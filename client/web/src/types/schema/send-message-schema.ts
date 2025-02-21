import { z } from "zod";

export const sendMessageSchema = z.object({
  chat_id: z.string(),
  prompt: z
    .string()
    .max(5000, "Message too long!")
    .min(0, "Please write something"),
  file: z.instanceof(File).optional().refine((file) => file && file.size < 7000000, {
    message: 'Your resume must be less than 7MB.',
  }),
});
