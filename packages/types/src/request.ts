import { z } from "zod";

// TODO: Learn what strict mode do in zod
export const RegisterUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(1),
  dob: z.coerce.date({ message: "Invalid date of birth" }),
  agreeToTerms: z.boolean().default(false),
});

export const LoginUserSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export const AddAttachmentSchema = z.object({
  url: z.string().url(),
  assetId: z.string(),
  publicId: z.string(),
  type: z.enum(["image", "video"]),
});

export const PostTypeSchema = z.enum(["regular", "poll"]);

export const CreateDraftSchema = z.object({
  type: PostTypeSchema,
  content: z.string().optional(),
});

export const CreateCommentSchema = z.object({
  postId: z.number(),
  content: z.string().min(1),
  parentId: z.number().optional(),
});

export const CastVoteSchema = z.object({
  optionId: z.number(),
});

export const CreateChatSchema = z.object({
  userId: z.number(),
});

export const CreateMessageSchema = z.object({
  content: z.string().min(1, { message: "Content is required" }),
});

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;
export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;
export type AddAttachmentSchemaType = z.infer<typeof AddAttachmentSchema>;
export type PostType = z.infer<typeof PostTypeSchema>;
export type CreateDraftSchemaType = z.infer<typeof CreateDraftSchema>;
export type CreateCommentSchemaType = z.infer<typeof CreateCommentSchema>;
export type CastVoteSchemaType = z.infer<typeof CastVoteSchema>;
export type CreateChatSchemaType = z.infer<typeof CreateChatSchema>;
export type CreateMessageSchemaType = z.infer<typeof CreateMessageSchema>;
