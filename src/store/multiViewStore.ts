import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MultiViewSource } from '../components/HogakPlayer/interfaces';

interface MultiViewState {
  multiViewSources: MultiViewSource[];
  setMultiViewSources: (multiViewSources: MultiViewSource[]) => void;
}

const useMultiViewStore = create<MultiViewState>()(
  persist(
    (set) => ({
      multiViewSources: [],
      setMultiViewSources: (multiViewSources: MultiViewSource[]) => set({ multiViewSources }),
    }),
    {
      name: 'multi-view-storage',
    },
  ),
)

export default useMultiViewStore;