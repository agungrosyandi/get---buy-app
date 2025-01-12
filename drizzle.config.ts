import { defineConfig } from "drizzle-kit";

import * as dotenv from "dotenv";

dotenv.config({
  path: ".env",
});

export default defineConfig({
  out: "./server/migrations.ts",
  schema: "./server/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
