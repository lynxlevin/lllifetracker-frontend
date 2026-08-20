import { format } from 'date-fns';
import { ReadingNoteAPI } from '../apis/ReadingNoteAPI';
import useJournalContext from './useJournalContext';
import useGlobalErrorContext from './useGlobalErrorContext';

const useReadingNoteAPI = () => {
    const { getJournals } = useJournalContext();
    const { handleAPIErrorThrowing } = useGlobalErrorContext();

    const createReadingNote = async (title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        await ReadingNoteAPI.create({ title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids })
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const updateReadingNote = async (id: string, title: string, page_number: number, text: string, date: Date, tag_ids: string[]) => {
        await ReadingNoteAPI.update(id, { title, page_number, text, date: format(date, 'yyyy-MM-dd'), tag_ids })
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteReadingNote = async (id: string) => {
        await ReadingNoteAPI.delete(id)
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    return {
        createReadingNote,
        updateReadingNote,
        deleteReadingNote,
    };
};

export default useReadingNoteAPI;
