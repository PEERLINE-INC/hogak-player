import { create } from 'zustand'
import { MultiViewSource } from '../components/HogakPlayer/interfaces';

interface MultiViewState {
  multiViewSources: MultiViewSource[];
  setMultiViewSources: (multiViewSources: MultiViewSource[]) => void;
  pendingSeek: number | null;
  setPendingSeek: (pendingSeek: number | null) => void;
  resetMultiViewStore: () => void;
}

const useMultiViewStore = create<MultiViewState>()(
  (set) => ({
    multiViewSources: [],
    setMultiViewSources: (multiViewSources: MultiViewSource[]) => set({ multiViewSources }),
    pendingSeek: null,
    setPendingSeek: (pendingSeek: number | null) => set({ pendingSeek }),
    resetMultiViewStore: () => set({
      multiViewSources: [],
      pendingSeek: null,
    }),
  })
)

export default useMultiViewStore;