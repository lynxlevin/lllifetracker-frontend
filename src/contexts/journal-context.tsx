import { createContext, useState, type ReactNode } from 'react';
import type { Journal } from '../types/journal';

interface JournalContextType {
    journalList: Journal[] | undefined;
}

interface SetJournalContextType {
    setJournalList: React.Dispatch<React.SetStateAction<Journal[] | undefined>>;
}

export const JournalContext = createContext<JournalContextType>({
    journalList: undefined,
});

export const SetJournalContext = createContext<SetJournalContextType>({
    setJournalList: () => {},
});

export const JournalProvider = ({ children }: { children: ReactNode }) => {
    const [journalList, setJournalList] = useState<Journal[]>();

    return (
        <JournalContext.Provider value={{ journalList }}>
            <SetJournalContext.Provider value={{ setJournalList }}>{children}</SetJournalContext.Provider>
        </JournalContext.Provider>
    );
};
