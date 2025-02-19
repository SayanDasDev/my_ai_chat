import { z } from "zod";

export const sendMessageSchema = z.object({
  chat_id: z.string(),
  prompt: z
    .string()
    .max(500, "Message too long!")
    .min(0, "Please write something"),
});
