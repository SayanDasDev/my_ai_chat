import { useTokenStore } from "@/hooks/use-token-store";
import { BACKEND_URL, ensureAuthenticated } from "@/lib/utils";


export const chatQuery = () => {

  const { accessToken } = useTokenStore.getState()

  const createChat = async () => {

    await ensureAuthenticated()

    const response = await fetch(`${BACKEND_URL}/chats/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "New Chat" })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();

  }

  const getAllChats = async () => {

    const response = await fetch(`${BACKEND_URL}/chats/`, {
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

  const getChat = async (id: string) => {

    const response = await fetch(`${BACKEND_URL}/chats/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json()

  }



  return { createChat, getAllChats, getChat }
}