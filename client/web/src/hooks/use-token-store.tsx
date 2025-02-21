import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TokenStore = {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
};

export const useTokenStore = create(
  persist<TokenStore>(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "token-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
