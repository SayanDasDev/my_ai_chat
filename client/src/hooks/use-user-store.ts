import { getInitials } from "@/lib/utils"
import { create } from "zustand"

type User = {
  id: string,
  username: string,
  email: string,
  initials: string,
  avatar: string,
}

interface UserState {
  user: User | undefined,
  setUser: (user: User) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  setUser: (user: User) => set({ user: { ...user, initials: getInitials(user.username) } })
}))