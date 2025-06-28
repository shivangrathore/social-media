import { z } from "zod";

export type PostType = "regular" | "poll";
export type AttachmentFile = {
  id: number;
  postId: number;
  userId: number;
  url: string;
  assetId: string;
  publicId: string;
  type: "image" | "video";
};

export type Post = {
  id: number;
  content: string | null;
  userId: number;
  postType: PostType;
  createdAt: Date;
  updatedAt: Date | null;
  likes: number;
  views: number;
  comments: number;
  bookmarked: boolean;
  attachments: AttachmentFile[];
};

export type User = {
  avatar: string | null;
  username: string;
  createdAt: Date;
  firstName: string;
  lastName: string;
};

export type Poll = {
  id: number;
  question: string;
  options: string[];
  userId: number;
  createdAt: Date;
};

// Validation zod
export const UpdatePollSchema = z.object({
  question: z.string(),
  options: z.array(z.string().min(1).max(100)).max(4),
});
