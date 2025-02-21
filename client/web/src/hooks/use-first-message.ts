import { create } from "zustand";

interface FirstMessageState {
  isFirstMessage: boolean;
  setIsFirstMessage: (isFirstMessage: boolean) => void;
}

export const useFirstMessage = create<FirstMessageState>((set) => ({
  isFirstMessage: false,
  setIsFirstMessage: (isFirstMessage: boolean) => set({ isFirstMessage }),
}));