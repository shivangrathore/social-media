import { ProviderUser } from "@/auth_providers/base";
import {
  RegisterUserSchemaType,
  AddAttachmentSchemaType,
} from "@repo/request-schemas";
import { IAttachment, IUser } from "@repo/types";

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
  deleteAttachment(attachmentId: number, userId: number): Promise<void>;
}
