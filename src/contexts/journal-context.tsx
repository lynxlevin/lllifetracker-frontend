import { createContext, Dispatch, SetStateAction, useState, type ReactNode } from 'react';
import { JOURNAL_SEARCH_PARAMS_DEFAULT, type Journal, type JournalSearchParams } from '../types/journal';

interface JournalContextType {
    journalList: Journal[] | undefined;
    searchParams: JournalSearchParams;
}

interface SetJournalContextType {
    setJournalList: Dispatch<SetStateAction<Journal[] | undefined>>;
    setSearchParams: Dispatch<SetStateAction<JournalSearchParams>>;
}

export const JournalContext = createContext<JournalContextType>({
    journalList: undefined,
    searchParams: JOURNAL_SEARCH_PARAMS_DEFAULT,
});

export const SetJournalContext = createContext<SetJournalContextType>({
    setJournalList: () => {},
    setSearchParams: () => {},
});

export const JournalProvider = ({ children }: { children: ReactNode }) => {
    const [journalList, setJournalList] = useState<Journal[]>();
    const [searchParams, setSearchParams] = useState<JournalSearchParams>(JOURNAL_SEARCH_PARAMS_DEFAULT);

    return (
        <JournalContext.Provider value={{ journalList, searchParams }}>
            <SetJournalContext.Provider value={{ setJournalList, setSearchParams }}>{children}</SetJournalContext.Provider>
        </JournalContext.Provider>
    );
};
