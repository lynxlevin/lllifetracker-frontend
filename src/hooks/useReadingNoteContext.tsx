import { useCallback, useContext, useState } from 'react';
import { format } from 'date-fns';
import { ReadingNoteContext, SetReadingNoteContext } from '../contexts/reading-note-context';
import { ReadingNoteAPI } from '../apis/ReadingNoteAPI';

const useReadingNoteContext = () => {
    const readingNoteContext = useContext(ReadingNoteContext);
    const setReadingNoteContext = useContext(SetReadingNoteContext);

    const [isLoading, setIsLoading] = useState(false);

    const readingNotes = readingNoteContext.readingNoteList;
    const clearReadingNotesCache = () => {
        setReadingNoteContext.setReadingNoteList(undefined);
    };

    const getReadingNotes = useCallback(() => {
        setIsLoading(true);
        ReadingNoteAPI.list()
            .then(res => {
                setReadingNoteContext.setReadingNoteList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setReadingNoteContext]);

    const createReadingNote = (title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        ReadingNoteAPI.create({ title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getReadingNotes();
        });
    };

    const updateReadingNote = (id: string, title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        ReadingNoteAPI.update(id, { title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getReadingNotes();
        });
    };

    const deleteReadingNote = (id: string) => {
        ReadingNoteAPI.delete(id).then(_ => {
            getReadingNotes();
        });
    };

    return {
        isLoading,
        readingNotes,
        clearReadingNotesCache,
        getReadingNotes,
        createReadingNote,
        updateReadingNote,
        deleteReadingNote,
    };
};

export default useReadingNoteContext;
