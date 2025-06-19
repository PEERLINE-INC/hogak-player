import { create } from 'zustand'
import { PrerollAdType } from '../components/HogakPlayer/interfaces';

interface AdState {
  isPlayAd: boolean;
  setIsPlayAd: (isPlayAd: boolean) => void;
  prerollAdType: PrerollAdType,
  setPrerollAdType: (prerollAdType: PrerollAdType) => void;
  prerollAdUrl: string;
  setPrerollAdUrl: (prerollAdUrl: string) => void;
  prerollAdSkipSeconds: number;
  setPrerollAdSkipSeconds: (adSkipSeconds: number) => void;
  resetAdStore: () => void;
}

const useAdStore = create<AdState>()(
  (set) => ({
    isPlayAd: false,
    setIsPlayAd: (isPlayAd: boolean) => set({ isPlayAd }),
    prerollAdType: null,
    setPrerollAdType: (prerollAdType: PrerollAdType) => set({ prerollAdType }),
    prerollAdUrl: '',
    setPrerollAdUrl: (prerollAdUrl: string) => set({ prerollAdUrl }),
    prerollAdSkipSeconds: 0,
    setPrerollAdSkipSeconds: (prerollAdSkipSeconds: number) => set({ prerollAdSkipSeconds }),
    resetAdStore: () => set({
      isPlayAd: false,
      prerollAdType: null,
      prerollAdUrl: '',
    }),
  })
)

export default useAdStore;