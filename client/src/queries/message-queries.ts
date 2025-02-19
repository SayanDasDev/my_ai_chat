import { useTokenStore } from "@/hooks/use-token-store";
import { BACKEND_URL } from "@/lib/utils";
import { sendMessageSchema } from "@/types/schema/send-message-schema";
import { z } from "zod";


export const messageQuery = () => {

  const { accessToken } = useTokenStore.getState()


  const createMessage = async (values: z.infer<typeof sendMessageSchema>) => {
    const response = await fetch(`${BACKEND_URL}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values)
    })


    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }


  return { createMessage }
}