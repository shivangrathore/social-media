import { ProviderUser } from "@/auth_providers/base";
import { postTable, userView } from "@/db/schema";
import {
  RegisterUserSchemaType,
  AddAttachmentSchemaType,
  PollMeta,
  Hashtag,
  Chat,
  ChatType,
} from "@repo/types";
import { Attachment, Comment, User } from "@repo/types";
import { PostType } from "@repo/types";
import { InferSelectModel, InferSelectViewModel } from "drizzle-orm";

export type IUser = Omit<User, "isFollowing">;
export type IAttachment = Attachment;
export type IComment = Comment;

export interface IAccount {
  id: number;
  userId: number;
  provider: string;
  providerAccountId: string;
  createdAt: Date;
  updatedAt: Date | null;
  accessToken: string | null;
  accessTokenExpiresAt: Date | null;
  password: string | null;
}

export interface IAuthRepository {
  register(
    payload: RegisterUserSchemaType,
    username: string,
    hashedPassword: string,
  ): Promise<void>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserByUsername(username: string): Promise<IUser | null>;
  findAccountByUserId(
    userId: number,
    provider: string,
  ): Promise<IAccount | null>;
  registerWithProvider(
    payload: ProviderUser,
    accessToken: string,
    username: string,
    provider: string,
  ): Promise<IUser | null>;
  createSession(userId: number, token: string, expires: Date): Promise<void>;
}

export interface IAttachmentRepository {
  addAttachment(
    payload: AddAttachmentSchemaType,
    userId: number,
    postId: number,
  ): Promise<IAttachment>;
  deleteAttachment(
    attachmentId: number,
    userId: number,
    postId: number,
  ): Promise<void>;
  getAttachmentsByPostId(postId: number): Promise<IAttachment[]>;
}

export interface IPost {
  id: number;
  userId: number;
  type: PostType;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  publishedAt: Date | null;
}

export interface IPostRepository {
  createDraft(userId: number, type: PostType, content?: string): Promise<IPost>;
  getDraftByUserAndType(userId: number, type: PostType): Promise<IPost | null>;
  updateContent(postId: number, content: string | null): Promise<IPost | null>;
  publish(postId: number): Promise<IPost | null>;
  getById(postId: number): Promise<IPost | null>;
  logView(postId: number, userId: number): Promise<void>;
  bookmarkPost(userId: number, postId: number): Promise<void>;
  unbookmarkPost(userId: number, postId: number): Promise<void>;
}

export interface IPollRepository {
  getPollByPostId(postId: number): Promise<IPollData | null>;
  createPoll(postId: number, expiresAt?: Date): Promise<void>;
  setOptions(postId: number, options: string[]): Promise<void>;
  getPollMeta(postId: number): Promise<PollMeta | null>;
  getOptionById(optionId: number): Promise<IPollOption | null>;
  createVote(
    pollId: number,
    userId: number,
    optionId: number,
  ): Promise<IPollOption>;
}

export interface ICommentsRepository {
  addComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<IComment>;
  removeComment(commentId: number): Promise<void>;
}

export interface IUserRepository {
  getById(userId: number): Promise<IUser | null>;
  suggestUsers(userId: number): Promise<IUser[]>;
  getByUsername(username: string): Promise<IUser | null>;
  searchUsers(userId: number, query: string): Promise<IUser[]>;
}

export interface IFeedPost {
  post: InferSelectModel<typeof postTable>;
  user: InferSelectViewModel<typeof userView>;
  bookmarkedByMe: boolean;
}

export interface IPollData {
  id: number;
  postId: number;
  expiresAt: Date | null;
  createdAt: Date;
}

export interface IPollOption {
  id: number;
  pollId: number;
  text: string;
  voteCount: number;
}

export interface IFeedRepository {
  getFeedPosts(
    userId: number,
    cursor?: number,
    limit?: number,
  ): Promise<IFeedPost[]>;
  getPollData(postId: number): Promise<IPollData | null>;
  getPollOptions(pollId: number): Promise<IPollOption[]>;
  getUserPollVote(pollId: number, userId: number): Promise<number | null>;
  getUserLikeStatus(postId: number, userId: number): Promise<boolean>;
  getUserPollVote(pollId: number, userId: number): Promise<number | null>;
}

export interface ILike {
  id: number;
  targetId: number;
  userId: number;
  targetType: "post" | "comment";
  createdAt: Date;
}

export interface ILikeRepository {
  findLike(
    targetId: number,
    userId: number,
    target: "post" | "comment",
  ): Promise<ILike | null>;
  addLike(
    targetId: number,
    userId: number,
    target: "post" | "comment",
  ): Promise<ILike>;
  removeLike(
    targetId: number,
    userId: number,
    target: "post" | "comment",
  ): Promise<ILike | null>;
}

export interface IHashtagRepository {
  linkHashtagToPost(hashtagId: number, postId: number): Promise<void>;
  upsert(name: string): Promise<Hashtag>;
  searchByName(name: string, limit?: number): Promise<Hashtag[]>;
}

export interface IFollowRepository {
  followUser(followerId: number, followingId: number): Promise<void>;
  unfollowUser(followerId: number, followingId: number): Promise<void>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
}

export interface IChatRepository {
  createChat(
    userIds: number[],
    type: ChatType,
    initiatorId: number,
  ): Promise<Chat>;
  getChats(userId: number, cursor?: number, limit?: number): Promise<Chat[]>;
  getChatById(chatId: number): Promise<Chat | null>;
}
