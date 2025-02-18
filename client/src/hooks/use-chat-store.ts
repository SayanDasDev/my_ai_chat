import { create } from "zustand"

type Chat = {
  id: string,
  name: string,
  created_at: string
}

interface ChatState {
  chat: Chat | undefined,
  setChat: (chat: Chat) => void
}

export const useChatStore = create<ChatState>((set) => ({
  chat: undefined,
  setChat: (chat: Chat) => set({ chat })
}))