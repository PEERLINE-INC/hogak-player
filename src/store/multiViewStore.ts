import { create } from 'zustand'
import { MultiViewSource } from '../components/HogakPlayer/interfaces';

interface MultiViewState {
  multiViewSources: MultiViewSource[];
  setMultiViewSources: (multiViewSources: MultiViewSource[]) => void;
}

const useMultiViewStore = create<MultiViewState>()(
  (set) => ({
    multiViewSources: [],
    setMultiViewSources: (multiViewSources: MultiViewSource[]) => set({ multiViewSources }),
  })
)

export default useMultiViewStore;