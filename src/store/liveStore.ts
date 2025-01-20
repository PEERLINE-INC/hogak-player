import { create } from 'zustand'

interface LiveState {
  atLive: boolean;
  setAtLive: (atLive: boolean) => void;
}

const useLiveStore = create<LiveState>()(
  (set) => ({
    atLive: false,
    setAtLive: (atLive: boolean) => set({ atLive }),
  }),
)

export default useLiveStore;
