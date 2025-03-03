import { z } from "zod";


export const feedbackSchema = z.object({
  message_id: z.string(),
  feedback: z.string(),
  rating: z.coerce.number().min(1).max(20)
})