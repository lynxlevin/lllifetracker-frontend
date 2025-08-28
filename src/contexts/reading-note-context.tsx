import { createContext, useState, type ReactNode } from 'react';
import type { ReadingNote } from '../types/journal';

interface ReadingNoteContextType {
    readingNoteList: ReadingNote[] | undefined;
}

interface SetReadingNoteContextType {
    setReadingNoteList: React.Dispatch<React.SetStateAction<ReadingNote[] | undefined>>;
}

export const ReadingNoteContext = createContext<ReadingNoteContextType>({
    readingNoteList: undefined,
});

export const SetReadingNoteContext = createContext<SetReadingNoteContextType>({
    setReadingNoteList: () => {},
});

export const ReadingNoteProvider = ({ children }: { children: ReactNode }) => {
    const [readingNoteList, setReadingNoteList] = useState<ReadingNote[]>();

    return (
        <ReadingNoteContext.Provider value={{ readingNoteList }}>
            <SetReadingNoteContext.Provider value={{ setReadingNoteList }}>{children}</SetReadingNoteContext.Provider>
        </ReadingNoteContext.Provider>
    );
};
