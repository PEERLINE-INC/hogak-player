import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TagMenuProps, TagProps } from '../components/HogakPlayer/interfaces';

interface TagState {
  tags: TagProps[];
  setTags: (tags: TagProps[]) => void;
  tagMenus: TagMenuProps[];
  setTagMenus: (tagMenus: TagMenuProps[]) => void;
}

const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      tags: [],
      setTags: (tags: TagProps[]) => set({ tags }),
      tagMenus: [],
      setTagMenus: (tagMenus: TagMenuProps[]) => set({ tagMenus }),
    }),
    {
      name: 'tag-store',
    },
  ),
)

export default useTagStore;