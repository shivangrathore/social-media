import { Request, Response } from "express";
import {
  pollRepository,
  postRepository,
  attachmentRepository,
  commentRepository,
  likeRepository,
  hashtagRepository,
} from "@/data/repositories";
import { IPost } from "@/data/repositories/respository";
import { ServiceError } from "@/utils/errors";
import {
  Attachment,
  CastVoteSchema,
  Comment,
  CreateAttachmentResponse,
  Like,
  PollMeta,
} from "@repo/types";
import { CreateDraftSchema, PostTypeSchema } from "@repo/types";
import { redis } from "@/db/redis";
import { extractHashtags } from "@/utils";
import { z } from "zod";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "@/config";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import s3 from "@/lib/s3";

const CreateAttachmentSchema = z.object({
  type: z.string().min(1, "Type is required"),
});

export async function getPresignedAttachment(
  key: string,
  type: string,
  userId: number,
  postId: number,
) {
  const post = await createPresignedPost(s3, {
    Bucket: config.MINIO_BUCKET,
    Key: key,
    Conditions: [["content-length-range", 0, 10 * 1024 * 1024]],
    Fields: {
      "Content-Type": type,
      "x-amz-meta-uploader": userId.toString(),
      "x-amz-meta-postId": postId.toString(),
    },
    Expires: Math.floor(Date.now() / 1000) + 300,
  });
  return {
    url: post.url,
    fields: post.fields,
  };
}

export async function objectExists(assetId: string) {
  const command = new GetObjectCommand({
    Bucket: config.MINIO_BUCKET,
    Key: assetId,
  });
  try {
    await s3.send(command);
    return true;
  } catch {
    return false;
  }
}

export const getDraft = async (req: Request, res: Response<IPost>) => {
  const userId = res.locals["userId"];
  const type = await PostTypeSchema.parseAsync(req.query.type);
  const post = await postRepository.getDraftByUserAndType(userId, type);
  if (!post) {
    throw ServiceError.NotFound("Draft not found");
  }
  res.status(200).json(post);
};

export const createDraft = async (req: Request, res: Response<IPost>) => {
  const userId = res.locals["userId"];
  const body = await CreateDraftSchema.parseAsync(req.body);
  const post = await postRepository.createDraft(
    userId,
    body.type,
    body.content,
  );
  if (body.type === "poll") {
    await pollRepository.createPoll(post.id);
  }
  res.status(201).json(post);
};

export const getAttachments = async (
  req: Request,
  res: Response<Attachment[]>,
) => {
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (post.userId !== res.locals["userId"]) {
    throw ServiceError.Forbidden(
      "You do not have permission to access this post's attachments",
    );
  }
  const attachments = await attachmentRepository.getAttachmentsByPostId(postId);
  res.status(200).json(attachments);
};

export const updateDraftContent = async (
  req: Request,
  res: Response<IPost | null>,
) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const content = req.body.content as string | null;

  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (post.userId !== userId) {
    throw ServiceError.Forbidden(
      "You do not have permission to edit this post",
    );
  }
  if (post.publishedAt) {
    throw ServiceError.BadRequest("Cannot update a published post");
  }
  const updatedPost = await postRepository.updateContent(postId, content);
  res.status(200).json(updatedPost);
};

export const publishDraft = async (req: Request, res: Response<IPost>) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);

  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (post.userId !== userId) {
    throw ServiceError.Forbidden(
      "You do not have permission to publish this post",
    );
  }
  if (post.publishedAt) {
    throw ServiceError.BadRequest("Post is already published");
  }

  const publishedPost = await postRepository.publish(postId);
  if (!publishedPost) {
    throw ServiceError.BadRequest("Post cannot be published");
  }
  const hashtags = extractHashtags(publishedPost.content);
  for (const hashtag of hashtags) {
    const htag = await hashtagRepository.upsert(hashtag);
    await hashtagRepository.linkHashtagToPost(htag.id, publishedPost.id);
    await redis.zincrby("trending_hashtags", 1, htag.name);
  }

  const attachments = await attachmentRepository.getAttachmentsByPostId(postId);
  for (const attachment of attachments) {
    // Delete attachments that do not exist in the storage
    const assetId = attachment.assetId;
    const exsists = await objectExists(assetId);
    if (!exsists) {
      await attachmentRepository.deleteAttachment(attachment.id, postId);
    }
  }
  res.status(200).json(publishedPost!);
};

export const getPoll = async (req: Request, res: Response<PollMeta>) => {
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (post.type !== "poll") {
    throw ServiceError.BadRequest("This post is not a poll");
  }

  const poll = await pollRepository.getPollMeta(postId);
  if (!poll) {
    throw ServiceError.NotFound("Poll not found");
  }

  res.status(200).json(poll);
};

export const updateOptions = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (post.type !== "poll") {
    throw ServiceError.BadRequest("This post is not a poll");
  }

  const options = req.body.options as string[];
  if (!Array.isArray(options) || options.length === 0) {
    throw ServiceError.BadRequest("Options must be a non-empty array");
  }

  await pollRepository.setOptions(postId, options);
  res.status(204).send();
};

export const addComment = async (req: Request, res: Response<Comment>) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);

  if (!post || !post.publishedAt) {
    throw ServiceError.NotFound("Post not found");
  }

  const content = req.body.content as string;

  if (!content || typeof content !== "string") {
    throw ServiceError.BadRequest("Content must be a non-empty string");
  }

  const comment = await commentRepository.addComment(userId, postId, content);
  const hashtags = extractHashtags(post.content);
  for (const hashtag of hashtags) {
    await redis.zincrby("trending_hashtags", 2, hashtag);
  }
  res.status(201).json(comment);
};

export async function addAttachment(
  req: Request,
  res: Response<CreateAttachmentResponse>,
) {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);

  if (isNaN(postId) || postId <= 0) {
    throw ServiceError.BadRequest("Invalid post ID");
  }

  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (post.publishedAt) {
    throw ServiceError.BadRequest("Cannot add attachments to a published post");
  }
  if (post.userId !== userId) {
    throw ServiceError.Forbidden(
      "You do not have permission to add attachments to this post",
    );
  }

  const { type } = await CreateAttachmentSchema.parseAsync(req.body);
  const key = "attachments/" + crypto.randomUUID();

  const presignedAttachment = await getPresignedAttachment(
    key,
    type,
    userId,
    postId,
  );

  const attachments = await attachmentRepository.getAttachmentsByPostId(postId);
  if (attachments.length >= 4) {
    throw ServiceError.BadRequest(
      "Cannot add more than 4 attachments to a post",
    );
  }

  const attachment = await attachmentRepository.addAttachment(
    { type },
    key,
    postId,
  );

  res.json({
    id: attachment.id,
    uploadUrl: presignedAttachment.url,
    fields: presignedAttachment.fields,
  });
}
export const addLike = async (req: Request, res: Response<Like>) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (!post.publishedAt) {
    throw ServiceError.BadRequest("Cannot like a unpublished post");
  }

  const existingLike = await likeRepository.findLike(post.id, userId, "post");
  if (existingLike) {
    throw ServiceError.BadRequest("You have already liked this post");
  }
  const like = await likeRepository.addLike(postId, userId, "post");
  const content = post.content;
  const hashtags = extractHashtags(content);
  for (const hashtag of hashtags) {
    await redis.zincrby("trending_hashtags", 2, hashtag);
  }
  res.status(201).json(like);
};

export const removeLike = async (req: Request, res: Response<Like>) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (!post.publishedAt) {
    throw ServiceError.BadRequest("Cannot remove like from a unpublished post");
  }

  const existingLike = await likeRepository.findLike(post.id, userId, "post");
  if (!existingLike) {
    throw ServiceError.NotFound("Like not found");
  }

  const hashtags = extractHashtags(post.content);
  for (const hashtag of hashtags) {
    await redis.zincrby("trending_hashtags", -2, hashtag);
  }

  const like = await likeRepository.removeLike(existingLike.id, post.id);
  res.status(204).send(like!);
};

export const logPostView = async (req: Request, res: Response) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (!post.publishedAt) {
    throw ServiceError.BadRequest("Cannot log view for an unpublished post");
  }

  await postRepository.logView(postId, userId);
  for (const hashtag of extractHashtags(post.content)) {
    await redis.zincrby("trending_hashtags", 0.01, hashtag);
  }
  res.status(204).send();
};

export const castVote = async (req: Request, res: Response) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const { optionId } = await CastVoteSchema.parseAsync(req.body);
  const post = await postRepository.getById(postId);
  if (!post || post.type !== "poll") {
    throw ServiceError.NotFound("Poll not found");
  }

  const poll = await pollRepository.getPollMeta(postId);
  if (!poll) {
    throw ServiceError.NotFound("Poll not found for this post");
  }

  const option = await pollRepository.getOptionById(optionId);
  if (!option || option.pollId !== poll.id) {
    throw ServiceError.NotFound("Poll option not found");
  }

  const newOption = await pollRepository.createVote(userId, poll.id, option.id);
  res.status(200).json(newOption);
};

export const bookmarkPost = async (req: Request, res: Response) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (!post.publishedAt) {
    throw ServiceError.BadRequest("Cannot bookmark an unpublished post");
  }

  await postRepository.bookmarkPost(userId, postId);
  res.status(204).send();
};

export const removeBookmark = async (req: Request, res: Response) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (!post.publishedAt) {
    throw ServiceError.BadRequest(
      "Cannot remove bookmark from an unpublished post",
    );
  }

  await postRepository.unbookmarkPost(userId, postId);
  res.status(204).send();
};
