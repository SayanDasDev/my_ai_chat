import { z } from "zod";


export const editChatSchema = z.object({
  id: z.string(),
  name: z.string().max(50, { message: "Chat name too long" }).min(5, { message: "Message too short" }),
})