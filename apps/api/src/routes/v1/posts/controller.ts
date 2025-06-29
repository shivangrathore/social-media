import { Request, Response } from "express";
import {
  pollRepository,
  postRepository,
  attachmentRepository,
  commentRepository,
} from "@/data/repositories";
import { IPost } from "@/data/repositories/respository";
import { ServiceError } from "@/utils/errors";
import { IAttachment, IComment } from "@repo/types";
import { PostTypeSchema } from "@repo/request-schemas";

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
  const type = await PostTypeSchema.parseAsync(req.query.type);
  const post = await postRepository.createDraft(userId, type);
  if (type === "poll") {
    await pollRepository.createPoll(post.id, "");
  }
  res.status(201).json(post);
};

export const getAttachments = async (
  req: Request,
  res: Response<IAttachment[]>,
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

export const publishDraft = async (
  req: Request,
  res: Response<IPost | null>,
) => {
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
  res.status(200).json(publishedPost);
};

export const getPoll = async (req: Request, res: Response) => {
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);
  if (!post) {
    throw ServiceError.NotFound("Post not found");
  }
  if (post.postType !== "poll") {
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
  if (post.postType !== "poll") {
    throw ServiceError.BadRequest("This post is not a poll");
  }

  const options = req.body.options as string[];
  if (!Array.isArray(options) || options.length === 0) {
    throw ServiceError.BadRequest("Options must be a non-empty array");
  }

  await pollRepository.setOptions(postId, options);
  res.status(204).send();
};

export const addComment = async (req: Request, res: Response<IComment>) => {
  const userId = res.locals["userId"];
  const postId = parseInt(req.params.postId, 10);
  const post = await postRepository.getById(postId);

  if (!post || !post.published) {
    throw ServiceError.NotFound("Post not found");
  }

  const content = req.body.content as string;

  if (!content || typeof content !== "string") {
    throw ServiceError.BadRequest("Content must be a non-empty string");
  }

  const comment = await commentRepository.addComment(userId, postId, content);
  res.status(201).json(comment);
};
