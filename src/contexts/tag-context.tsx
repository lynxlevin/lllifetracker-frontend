import { createContext, useState, type ReactNode } from 'react';
import type { Tag } from '../types/tag';

interface TagContextType {
    tagList: Tag[] | undefined;
}

interface SetTagContextType {
    setTagList: React.Dispatch<React.SetStateAction<Tag[] | undefined>>;
}

export const TagContext = createContext<TagContextType>({
    tagList: undefined,
});

export const SetTagContext = createContext<SetTagContextType>({
    setTagList: () => {},
});

export const TagProvider = ({ children }: { children: ReactNode }) => {
    const [tagList, setTagList] = useState<Tag[]>();

    return (
        <TagContext.Provider value={{ tagList }}>
            <SetTagContext.Provider value={{ setTagList }}>{children}</SetTagContext.Provider>
        </TagContext.Provider>
    );
};
