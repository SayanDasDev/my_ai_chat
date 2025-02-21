import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type Chat = {
  id: string,
  name: string,
  created_at: string
}

interface ChatState {
  chats: Chat[] | undefined,
  setChats: (chat: Chat[]) => void
  clearChats: () => void
}

export const useChatStore = create(
  persist<ChatState>((set) => ({
    chats: undefined,
    setChats: (chats: Chat[]) => set({ chats }),
    clearChats: () => {
      sessionStorage.removeItem(`all-chats`)
      set({ chats: undefined })
    }
  }),
    {
      name: `all-chats`,
      storage: createJSONStorage(() => sessionStorage)
    })
)