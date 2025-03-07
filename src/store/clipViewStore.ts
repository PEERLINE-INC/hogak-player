import { create } from 'zustand'

interface ClipState {
  currentSeconds: number;
  setCurrentSeconds: (currentSeconds: number) => void;
  eventId: string;
  setEventId: (eventId: string) => void;
  clipApiHost: string;
  setClipApiHost: (clipApiHost: string) => void;
  resetClipViewStore: () => void;
}

const useClipStore = create<ClipState>()(
  (set) => ({
    currentSeconds: 0,
    setCurrentSeconds: (currentSeconds: number) => set({ currentSeconds }),
    eventId: '',
    setEventId: (eventId: string) => set({ eventId }),
    clipApiHost: '',
    setClipApiHost: (clipApiHost: string) => set({ clipApiHost }),
    resetClipViewStore: () => set({
      currentSeconds: 0,
      eventId: '',
      clipApiHost: '',
    }),
  }),
)

export default useClipStore;