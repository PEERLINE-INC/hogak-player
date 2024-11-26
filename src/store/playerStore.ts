import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PlayerState {
  url: string;
  setUrl: (url: string) => void;
  pip: boolean;
  setPip: (pip: boolean) => void;
  isPlay: boolean;
  setIsPlay: (isPlay: boolean) => void;
  isSeek: boolean;
  setIsSeek: (isSeek: boolean) => void;
  duration: number;
  setDuration: (duration: number) => void;
  played: number;
  setPlayed: (played: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      url: '',
      setUrl: (url: string) => set({ url }),
      pip: false,
      setPip: (pip: boolean) => set({ pip }),
      isPlay: false,
      setIsPlay: (isPlay: boolean) => set({ isPlay }),
      isSeek: false,
      setIsSeek: (isSeek: boolean) => set({ isSeek }),
      duration: 0,
      setDuration: (duration: number) => set({ duration }),
      played: 0,
      setPlayed: (played: number) => set({ played }),
      volume: 1.0,
      setVolume: (volume: number) => set({ volume }),
    }),
    {
      name: 'player-storage',
    },
  ),
)

export default usePlayerStore;