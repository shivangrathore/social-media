import { Request, Response } from "express";
import {
  userRepository,
  followRepository,
  postRepository,
  commentRepository,
} from "@/data/repositories";
import { ServiceError } from "@/utils/errors";
import { Comment, GetUserCommentsResponse, Post, User } from "@repo/types";
import { z } from "zod";

export const getCurrentUser = async (
  req: Request,
  res: Response<User>,
): Promise<void> => {
  const userId = res.locals["userId"];
  const user = await userRepository.getById(userId);
  if (!user) {
    throw ServiceError.NotFound("User not found");
  }
  res.json(user);
};

export const suggestUsers = async (
  req: Request,
  res: Response<User[]>,
): Promise<void> => {
  const userId = res.locals["userId"];
  const users = await userRepository.suggestUsers(userId);
  res.json(users);
};

export const getUserByUsername = async (
  req: Request,
  res: Response<User>,
): Promise<void> => {
  const userId = res.locals["userId"];
  const { username } = req.params;
  const user = await userRepository.getByUsername(username);
  if (!user) {
    console.log("User not found:", username);
    throw ServiceError.NotFound("User not found");
  }
  let isFollowing = false;
  isFollowing = await followRepository.isFollowing(userId, user.id);
  res.json({ ...user, isFollowing });
};

export const followUser = async (
  req: Request,
  res: Response<void>,
): Promise<void> => {
  const userId = res.locals["userId"];
  const { username } = req.params;
  const user = await userRepository.getByUsername(username);
  if (!user) {
    throw ServiceError.NotFound("User not found");
  }
  await followRepository.followUser(userId, user.id);
  res.status(204).send();
};

export const unfollowUser = async (
  req: Request,
  res: Response<void>,
): Promise<void> => {
  const userId = res.locals["userId"];
  const { username } = req.params;
  const user = await userRepository.getByUsername(username);
  if (!user) {
    throw ServiceError.NotFound("User not found");
  }
  await followRepository.unfollowUser(userId, user.id);
  res.status(204).send();
};

export const searchUsers = async (
  req: Request,
  res: Response<User[]>,
): Promise<void> => {
  const userId = res.locals["userId"];
  const schema = z.object({
    query: z.string(),
    ignoreMe: z.coerce.boolean().optional(),
  });
  const { query, ignoreMe } = await schema.parseAsync(req.query);
  const users = await userRepository.searchUsers(userId, query, ignoreMe);
  res.json(users);
};

const UserCommentQuerySchema = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const getUserComments = async (
  req: Request,
  res: Response<GetUserCommentsResponse>,
): Promise<void> => {
  const id = z.coerce.number().parse(req.params.id);
  const { cursor, limit } = await UserCommentQuerySchema.parseAsync(req.query);
  const user = await userRepository.getById(id);
  if (!user) {
    throw ServiceError.NotFound("User not found");
  }
  if (!user.isProfilePublic) {
    throw ServiceError.Forbidden("User profile is private");
  }
  const data = await commentRepository.getByUserId(user.id, cursor, limit + 1);
  const comments = data.slice(0, limit);
  let nextCursor: number | null = null;
  if (comments.length < data.length) {
    nextCursor = comments[comments.length - 1].id;
  }

  res.json({
    data,
    nextCursor,
  });
};
