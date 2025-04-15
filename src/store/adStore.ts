import { create } from 'zustand'

interface AdState {
  isPlayAd: boolean;
  setIsPlayAd: (isPlayAd: boolean) => void;
  enablePrerollAd: boolean;
  setEnablePrerollAd: (enablePrerollAd: boolean) => void;
  prerollAdUrl: string;
  setPrerollAdUrl: (prerollAdUrl: string) => void;
  resetAdStore: () => void;
}

const useAdStore = create<AdState>()(
  (set) => ({
    isPlayAd: false,
    setIsPlayAd: (isPlayAd: boolean) => set({ isPlayAd }),
    enablePrerollAd: false,
    setEnablePrerollAd: (enablePrerollAd: boolean) => set({ enablePrerollAd }),
    prerollAdUrl: '',
    setPrerollAdUrl: (prerollAdUrl: string) => set({ prerollAdUrl }),
    resetAdStore: () => set({
      isPlayAd: false,
      enablePrerollAd: false,
      prerollAdUrl: '',
    }),
  })
)

export default useAdStore;