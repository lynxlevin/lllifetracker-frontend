import { useCallback, useContext, useState } from 'react';
import { format } from 'date-fns';
import { BookExcerptContext } from '../contexts/book-excerpt-context';
import { BookExcerptAPI } from '../apis/BookExcerptAPI';

const useBookExcerptContext = () => {
    const bookExcerptContext = useContext(BookExcerptContext);

    const [isLoading, setIsLoading] = useState(false);

    const bookExcerpts = bookExcerptContext.bookExcerptList;
    const clearBookExcerptsCache = () => {
        bookExcerptContext.setBookExcerptList(undefined);
    };

    const getBookExcerpts = useCallback(() => {
        setIsLoading(true);
        BookExcerptAPI.list()
            .then(res => {
                bookExcerptContext.setBookExcerptList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [bookExcerptContext]);

    const createBookExcerpt = (title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        BookExcerptAPI.create({ title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getBookExcerpts();
        });
    };

    const updateBookExcerpt = (id: string, title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        BookExcerptAPI.update(id, { title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getBookExcerpts();
        });
    };

    const deleteBookExcerpt = (id: string) => {
        BookExcerptAPI.delete(id).then(_ => {
            getBookExcerpts();
        });
    };

    return {
        isLoading,
        bookExcerpts,
        clearBookExcerptsCache,
        getBookExcerpts,
        createBookExcerpt,
        updateBookExcerpt,
        deleteBookExcerpt,
    };
};

export default useBookExcerptContext;
