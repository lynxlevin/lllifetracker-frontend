import { createContext } from 'react';
import type { Memo } from '../types/memo';

interface MemoContextType {
    memoList: Memo[] | undefined;
    setMemoList: React.Dispatch<React.SetStateAction<Memo[] | undefined>>;
}

export const MemoContext = createContext({
    memoList: undefined,
    setMemoList: () => {},
} as MemoContextType);
