import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  DATABASE_URL: z.string().url(),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_HOST: z.string().default("localhost"),
  MINIO_ENDPOINT: z.string().url(),
  MINIO_ACCESS_KEY: z.string().min(1),
  MINIO_SECRET_KEY: z.string().min(1),
  MINIO_BUCKET: z.string().min(1),
});

export default envSchema.parse(process.env);
