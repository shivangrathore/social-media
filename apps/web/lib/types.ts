import { z } from "zod";

export const LoginFormSchema = z.object({
  id: z.string().min(1, { message: "Username or Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
