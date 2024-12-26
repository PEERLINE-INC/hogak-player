import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ClipState {
  currentSeconds: number;
  setCurrentSeconds: (currentSeconds: number) => void;
}

const useClipStore = create<ClipState>()(
  persist(
    (set) => ({
      currentSeconds: 0,
      setCurrentSeconds: (currentSeconds: number) => set({ currentSeconds }),
    }),
    {
      name: 'clip-store',
    },
  ),
)

export default useClipStore;