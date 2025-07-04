import { PostType } from "./request";

export interface User {
  id: number;
  username: string;
  createdAt: Date;
  avatar: string | null;
  name: string | null;
}
export interface Attachment {
  id: number;
  url: string;
  assetId: string;
  publicId: string;
  type: "image" | "video";
  userId: number;
  postId: number;
  createdAt: Date;
}

export interface Post {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  attachments: Attachment[];
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  parentId: number | null;
  content: string;
  createdAt: Date;
}

interface BasePost {
  id: number;
  userId: number;
  type: PostType;
  content: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  publishedAt: Date | null;
}

export interface DraftPost extends BasePost {}
export interface Post extends BasePost {
  attachments: Attachment[];
}

export interface PollMeta {
  options: string[];
  expiresAt: Date | null;
}
