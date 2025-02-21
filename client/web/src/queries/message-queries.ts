import { useTokenStore } from "@/hooks/use-token-store";
import { BACKEND_URL, ensureAuthenticated } from "@/lib/utils";
import { sendMessageSchema } from "@/types/schema/send-message-schema";
import { z } from "zod";


export const messageQuery = () => {

  const { accessToken } = useTokenStore.getState()


  const createMessage = async (values: z.infer<typeof sendMessageSchema>, isFirstMessage: boolean) => {

    await ensureAuthenticated()

    const response = await fetch(`${BACKEND_URL}/messages/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, generate_chat_name: isFirstMessage })
    })


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }


  const getAllMessages = async (id: string) => {

    if (id == "") {
      throw new Error(`Cant find ChatId`);
    }

    const response = await fetch(`${BACKEND_URL}/messages/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();

  }


  return { createMessage, getAllMessages }
}