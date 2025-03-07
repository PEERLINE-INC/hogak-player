import { create } from 'zustand'

interface LiveState {
  atLive: boolean;
  setAtLive: (atLive: boolean) => void;
  resetLiveStore: () => void;
}

const useLiveStore = create<LiveState>()(
  (set) => ({
    atLive: false,
    setAtLive: (atLive: boolean) => set({ atLive }),
    resetLiveStore: () => set({
      atLive: false,
    }),
  }),
)

export default useLiveStore;
