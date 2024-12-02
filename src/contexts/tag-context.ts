import { createContext } from 'react';
import type { Tag } from '../types/tag';

interface TagContextType {
    tagList: Tag[] | undefined;
    setTagList: React.Dispatch<React.SetStateAction<Tag[] | undefined>>;
}

export const TagContext = createContext({
    tagList: undefined,
    setTagList: () => {},
} as TagContextType);
