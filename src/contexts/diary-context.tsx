import { createContext, useState, type ReactNode } from 'react';
import type { Diary } from '../types/journal';

interface DiaryContextType {
    diaryList: Diary[] | undefined;
}

interface SetDiaryContextType {
    setDiaryList: React.Dispatch<React.SetStateAction<Diary[] | undefined>>;
}

export const DiaryContext = createContext<DiaryContextType>({
    diaryList: undefined,
});

export const SetDiaryContext = createContext<SetDiaryContextType>({
    setDiaryList: () => {},
});

export const DiaryProvider = ({ children }: { children: ReactNode }) => {
    const [diaryList, setDiaryList] = useState<Diary[]>();

    return (
        <DiaryContext.Provider value={{ diaryList }}>
            <SetDiaryContext.Provider value={{ setDiaryList }}>{children}</SetDiaryContext.Provider>
        </DiaryContext.Provider>
    );
};
