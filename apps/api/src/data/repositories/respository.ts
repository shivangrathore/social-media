import { ProviderUser } from "@/auth_providers/base";
import {
  RegisterUserSchemaType,
  AddAttachmentSchemaType,
} from "@repo/request-schemas";
import { IAttachment, IComment, IUser } from "@repo/types";
import { PostType } from "@repo/request-schemas";

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
  content: string | null;
  createdAt: Date;
  published: boolean;
  updatedAt: Date | null;
  postType: PostType;
}

export interface IPostRepository {
  createDraft(userId: number, type: PostType): Promise<IPost>;
  getDraftByUserAndType(userId: number, type: PostType): Promise<IPost | null>;
  updateContent(postId: number, content: string | null): Promise<IPost | null>;
  publish(postId: number): Promise<IPost | null>;
  getById(postId: number): Promise<IPost | null>;
}

export interface IPollRepository {
  createPoll(postId: number, question: string, expiresAt?: Date): Promise<void>;
  setOptions(postId: number, options: string[]): Promise<void>;
  getPollMeta(postId: number): Promise<{
    question: string;
    options: string[];
    expiresAt: Date | null;
  } | null>;
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
}
