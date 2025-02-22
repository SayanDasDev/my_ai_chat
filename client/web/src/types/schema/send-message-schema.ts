import { z } from "zod";

export const sendMessageSchema = z.object({
  chat_id: z.string(),
  prompt: z
    .string()
    .max(5000, "Message too long!")
    .min(0, "Please write something"),
  file: z.union([z.instanceof(File), z.undefined()]).optional().refine((file) => !file || file.size < 7000000, {
    message: 'Your file must be less than 7MB.',
  }),
  remember_past: z.boolean(),
});
