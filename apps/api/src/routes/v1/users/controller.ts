import { Request, Response } from "express";
import {
  userRepository,
  followRepository,
  postRepository,
  commentRepository,
} from "@/data/repositories";
import { ServiceError } from "@/utils/errors";
import { Comment, Post, User } from "@repo/types";
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
  const { query } = req.query;
  if (!query || typeof query !== "string") {
    throw ServiceError.BadRequest("Query parameter is required");
  }
  const users = await userRepository.searchUsers(userId, query);
  res.json(users);
};

export const getUserComments = async (
  req: Request,
  res: Response<Comment[]>,
): Promise<void> => {
  const id = z.coerce.number().parse(req.params.id);
  const user = await userRepository.getById(id);
  if (!user) {
    throw ServiceError.NotFound("User not found");
  }
  if (!user.isProfilePublic) {
    throw ServiceError.Forbidden("User profile is private");
  }
  const comments = await commentRepository.getByUserId(user.id);
  res.json(comments);
};
