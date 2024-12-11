import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TagProps } from '../components/HogakPlayer/interfaces';

interface TagState {
  tags: TagProps[];
  setTags: (tags: TagProps[]) => void;
}

const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: [],
      setTags: (tags: TagProps[]) => set({ tags }),
    }),
    {
      name: 'tag-store',
    },
  ),
)

export default useTagStore;