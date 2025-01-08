import { create } from 'zustand'

interface ClipState {
  currentSeconds: number;
  setCurrentSeconds: (currentSeconds: number) => void;
}

const useClipStore = create<ClipState>()(
  (set) => ({
    currentSeconds: 0,
    setCurrentSeconds: (currentSeconds: number) => set({ currentSeconds }),
  }),
)

export default useClipStore;