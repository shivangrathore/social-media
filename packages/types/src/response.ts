import { Comment, FeedPost, User } from "./types";

export type LoginResponse = {
  message: string;
  user: User;
};

export type RegisterResponse = {
  message: string;
};

export type GetSignatureResponse = {
  signature: string;
  apiKey: string;
  folder: string;
  timestamp: string;
  context: string;
  uploadUrl: string;
};

export type GetFeedResponse = {
  data: FeedPost[];
  nextCursor: number | null;
};

export type GetUserCommentsResponse = {
  data: Comment[];
  nextCursor: number | null;
};
