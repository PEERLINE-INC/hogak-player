import QualityLevel from 'videojs-contrib-quality-levels/dist/types/quality-level'
import { create } from 'zustand'

interface QualityState {
  qualityLevels: (QualityLevel & { url?: string })[]
  setQualityLevels: (callback: (prev: QualityLevel[]) => QualityLevel[]) => void
  currentQuality: number | null
  setCurrentQuality: (quality: number) => void
  clearQualityLevels: () => void
}

const useQualityStore = create<QualityState>()((set) => ({
  qualityLevels: [],
  setQualityLevels: (callback) => {
    set((state) => {
      const newLevels = callback(state.qualityLevels)
      return { ...state, qualityLevels: newLevels }
    })
  },
  currentQuality: 1080,
  setCurrentQuality: (quality) => {
    set({ currentQuality: quality })
  },
  clearQualityLevels: () => {
    set({ qualityLevels: [] })
  },
}))

export default useQualityStore
