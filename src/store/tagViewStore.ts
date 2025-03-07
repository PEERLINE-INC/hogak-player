import { create } from 'zustand'
import { TagMenuProps, TagProps } from '../components/HogakPlayer/interfaces';

interface TagState {
  tags: TagProps[];
  setTags: (tags: TagProps[]) => void;
  tagMenus: TagMenuProps[];
  setTagMenus: (tagMenus: TagMenuProps[]) => void;
  resetTagStore: () => void;
}

const useTagStore = create<TagState>()(
  (set) => ({
    tags: [],
    setTags: (tags: TagProps[]) => set({ tags }),
    tagMenus: [],
    setTagMenus: (tagMenus: TagMenuProps[]) => set({ tagMenus }),
    resetTagStore: () => set({
      tags: [],
      tagMenus: [],
    }),
  })
)

export default useTagStore;