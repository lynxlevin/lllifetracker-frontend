import { DiaryAPI } from '../apis/DiaryAPI';
import { format } from 'date-fns';
import type { DiaryKey } from '../types/journal';
import useJournalContext from './useJournalContext';
import useGlobalErrorContext from './useGlobalErrorContext';

const useDiaryAPI = () => {
    const { getJournals } = useJournalContext();
    const { handleAPIErrorThrowing } = useGlobalErrorContext();

    const createDiary = async (text: string | null, date: Date, tag_ids: string[]) => {
        await DiaryAPI.create({ text, date: format(date, 'yyyy-MM-dd'), tag_ids })
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const updateDiary = async (id: string, text: string | null, date: Date, tag_ids: string[], update_keys: DiaryKey[]) => {
        await DiaryAPI.update(id, { text, date: format(date, 'yyyy-MM-dd'), tag_ids, update_keys })
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteDiary = async (id: string) => {
        await DiaryAPI.delete(id)
            .then(_ => {
                getJournals();
            })
            .catch(handleAPIErrorThrowing);
    };

    return {
        createDiary,
        updateDiary,
        deleteDiary,
    };
};

export default useDiaryAPI;
