import { format } from 'date-fns';
import { ReadingNoteAPI } from '../apis/ReadingNoteAPI';
import useJournalContext from './useJournalContext';

const useReadingNoteAPI = () => {
    const { clearJournalsCache } = useJournalContext();

    const createReadingNote = (title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        ReadingNoteAPI.create({ title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            clearJournalsCache();
        });
    };

    const updateReadingNote = (id: string, title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        ReadingNoteAPI.update(id, { title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            clearJournalsCache();
        });
    };

    const deleteReadingNote = (id: string) => {
        ReadingNoteAPI.delete(id).then(_ => {
            clearJournalsCache();
        });
    };

    return {
        createReadingNote,
        updateReadingNote,
        deleteReadingNote,
    };
};

export default useReadingNoteAPI;
