import { useTokenStore } from "@/hooks/use-token-store";
import { BACKEND_URL, ensureAuthenticated } from "@/lib/utils";
import { sendMessageSchema } from "@/types/schema/send-message-schema";
import { z } from "zod";


export const messageQuery = () => {

  const { accessToken } = useTokenStore.getState()


  const createMessage = async (values: z.infer<typeof sendMessageSchema>, isFirstMessage: boolean) => {
    await ensureAuthenticated();

    const formData = new FormData();
    formData.append("chat_id", values.chat_id);
    formData.append("prompt", values.prompt);
    formData.append("generate_chat_name", String(isFirstMessage));
    if (values.file) {
      formData.append("file", values.file);
    }

    const response = await fetch(`${BACKEND_URL}/messages/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };


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