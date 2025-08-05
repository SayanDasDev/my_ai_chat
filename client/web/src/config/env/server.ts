import { createEnv } from "@t3-oss/env-nextjs";
import { z, ZodError } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    DATABASE_URL: z.string().url(),
  },
  emptyStringAsUndefined: true,

  experimental__runtimeEnv: process.env,
  // Called when the schema validation fails.
  onValidationError: (error) => {
    if (error instanceof ZodError) {
      console.error(
        "❌ Invalid environment variables:",
        error.flatten().fieldErrors
      );
    }
    process.exit(1);
  },
});