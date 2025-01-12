import { createContext, useState, type ReactNode } from 'react';
import type { Memo } from '../types/memo';

interface MemoContextType {
    memoList: Memo[] | undefined;
}

interface SetMemoContextType {
    setMemoList: React.Dispatch<React.SetStateAction<Memo[] | undefined>>;
}

export const MemoContext = createContext<MemoContextType>({
    memoList: undefined,
});

export const SetMemoContext = createContext<SetMemoContextType>({
    setMemoList: () => {},
});

export const MemoProvider = ({ children }: { children: ReactNode }) => {
    const [memoList, setMemoList] = useState<Memo[]>();

    return (
        <MemoContext.Provider value={{ memoList }}>
            <SetMemoContext.Provider value={{ setMemoList }}>{children}</SetMemoContext.Provider>
        </MemoContext.Provider>
    );
};
