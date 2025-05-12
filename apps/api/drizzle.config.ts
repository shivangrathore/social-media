import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./dist/db/schema.js",
  dbCredentials: {
    url: "postgresql://postgres:postgres@localhost:5432/postgres",
  },
});
