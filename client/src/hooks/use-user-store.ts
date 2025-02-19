import { getInitials } from "@/lib/utils"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

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

export const useUserStore = create(
  persist<UserState>(
    (set) => ({
      user: undefined,
      setUser: (user: User) => set((state) => ({ ...state, user: { ...user, initials: getInitials(user.username) } }))
    }),
    {
      name: `user`,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)