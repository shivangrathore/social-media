import { z } from "zod";

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  dob: z.coerce.date(),
});

export const LoginSchema = z.object({
  id: z.string(),
  password: z.string().min(8),
});

export const CreatePostSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  attachments: z.array(z.string().url()).optional(),
});

export const UpdateDraftSchema = z.object({
  content: z.string().optional(),
});

export const EditCommentSchema = z.object({
  content: z.string(),
});

export const AddAttachmentSchema = z.object({});

export const PostAttachmentSignatureSchema = z.object({
  postId: z.string(),
});

export const CastVoteSchema = z.object({
  optionId: z.number(),
});
