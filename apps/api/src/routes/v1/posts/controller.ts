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
  Like,
  PollMeta,
} from "@repo/types";
import {
  AddAttachmentSchema,
  CreateDraftSchema,
  PostTypeSchema,
} from "@repo/types";

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

  const publishedPost = await postRepository.publish(postId);
  if (!publishedPost) {
    throw ServiceError.BadRequest("Post cannot be published");
  }
  const content = publishedPost.content;
  // FIXME: content should not be null, but handle it gracefully
  const hashtagMatches =
    content?.match(/#([A-Za-z0-9]+(?:-[A-Za-z0-9]+)*)/g) || [];
  console.log("Hashtag matches:", hashtagMatches);
  const hashtags = hashtagMatches.map((tag) => tag.slice(1).toLowerCase());
  console.log("Extracted hashtags:", hashtags);

  for (const hashtag of hashtags) {
    const htag = await hashtagRepository.upsert(hashtag);
    await hashtagRepository.linkHashtagToPost(htag.id, publishedPost.id);
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
  res.status(201).json(comment);
};

export const addAttachment = async (
  req: Request,
  res: Response<Attachment>,
) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post || post.publishedAt) {
    throw ServiceError.NotFound("Post not found or already published");
  }
  if (post.userId !== userId) {
    throw ServiceError.Forbidden(
      "You do not have permission to add attachments to this post",
    );
  }
  const body = await AddAttachmentSchema.parseAsync(req.body);
  const attachment = await attachmentRepository.addAttachment(
    body,
    userId,
    postId,
  );

  res.json(attachment);
};

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
