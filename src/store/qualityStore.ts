import QualityLevel from 'videojs-contrib-quality-levels/dist/types/quality-level';
import { create } from 'zustand'

interface QualityState {
  qualityLevels: QualityLevel[];
  setQualityLevels: (callback: (prev: QualityLevel[]) => QualityLevel[]) => void;
  currentQuality: number;
  setCurrentQuality: (quality: number) => void;
}

const useQualityStore = create<QualityState>()(
  (set) => ({
    qualityLevels: [],
    setQualityLevels: (callback) => {
      set((state) => {
        const newLevels = callback(state.qualityLevels);
        return { ...state, qualityLevels: newLevels };
      });
    },
    currentQuality: 1080,
    setCurrentQuality: (quality) => {
      set({ currentQuality: quality });
    },
  }),
)

export default useQualityStore;
