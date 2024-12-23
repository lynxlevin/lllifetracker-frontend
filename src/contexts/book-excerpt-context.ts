import { createContext } from 'react';
import type { BookExcerpt } from '../types/book_excerpt';

interface BookExcerptContextType {
    bookExcerptList: BookExcerpt[] | undefined;
    setBookExcerptList: React.Dispatch<React.SetStateAction<BookExcerpt[] | undefined>>;
}

export const BookExcerptContext = createContext({
    bookExcerptList: undefined,
    setBookExcerptList: () => {},
} as BookExcerptContextType);
