import { z } from "zod";

export const LoginFormSchema = z.object({
  id: z.string().min(1, { message: "Username or Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  dob: z.date({ message: "Invalid date of birth" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  agreeToTerms: z.boolean(),
});
