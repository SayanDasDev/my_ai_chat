import { create } from "zustand";

interface PastAwareState {
  isPastAware: boolean;
  setIsPastAware: (isPastAware: boolean) => void;
}

export const usePastAware = create<PastAwareState>((set) => ({
  isPastAware: true,
  setIsPastAware: (isPastAware: boolean) => set({ isPastAware }),
}));