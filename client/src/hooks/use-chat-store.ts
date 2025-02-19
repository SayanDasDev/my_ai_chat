import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

type Chat = {
  id: string,
  name: string,
  created_at: string
}

interface ChatState {
  chat: Chat[] | undefined,
  setChat: (chat: Chat[]) => void
}

export const useChatStore = create(
  persist<ChatState>((set) => ({
    chat: undefined,
    setChat: (chat: Chat[]) => set({ chat })
  }),
    {
      name: `all-chats`,
      storage: createJSONStorage(() => sessionStorage)
    })
)