import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(50),
  username: z.string().min(3).max(50),
});

export const LoginSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8),
});

export const CreatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
});

export const EditCommentSchema = z.object({
  content: z.string(),
});
