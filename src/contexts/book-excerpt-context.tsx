import { createContext, useState, type ReactNode } from 'react';
import type { BookExcerpt } from '../types/book_excerpt';

interface BookExcerptContextType {
    bookExcerptList: BookExcerpt[] | undefined;
}

interface SetBookExcerptContextType {
    setBookExcerptList: React.Dispatch<React.SetStateAction<BookExcerpt[] | undefined>>;
}

export const BookExcerptContext = createContext<BookExcerptContextType>({
    bookExcerptList: undefined,
});

export const SetBookExcerptContext = createContext<SetBookExcerptContextType>({
    setBookExcerptList: () => {},
});

export const BookExcerptProvider = ({ children }: { children: ReactNode }) => {
    const [bookExcerptList, setBookExcerptList] = useState<BookExcerpt[]>();

    return (
        <BookExcerptContext.Provider value={{ bookExcerptList }}>
            <SetBookExcerptContext.Provider value={{ setBookExcerptList }}>{children}</SetBookExcerptContext.Provider>
        </BookExcerptContext.Provider>
    );
};
