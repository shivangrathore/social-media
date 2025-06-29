import { z } from "zod";

// TODO: Learn what strict mode do in zod
export const RegisterUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  dob: z.coerce.date(),
});

export const LoginUserSchema = z.object({
  id: z.string(),
  password: z.string().min(8),
});

export const AddAttachmentSchema = z.object({
  url: z.string().url(),
  assetId: z.string(),
  publicId: z.string(),
  type: z.enum(["image", "video"]),
});

export type RegisterUserSchemaType = z.infer<typeof RegisterUserSchema>;
export type LoginUserSchemaType = z.infer<typeof LoginUserSchema>;
export type AddAttachmentSchemaType = z.infer<typeof AddAttachmentSchema>;
