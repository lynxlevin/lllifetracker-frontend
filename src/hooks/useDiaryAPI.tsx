import { DiaryAPI } from '../apis/DiaryAPI';
import { format } from 'date-fns';
import type { DiaryKey } from '../types/journal';
import type { AxiosError, AxiosResponse } from 'axios';
import useJournalContext from './useJournalContext';

const useDiaryAPI = () => {
    const { getJournals } = useJournalContext();

    const createDiary = (text: string | null, date: Date, tag_ids: string[]) => {
        DiaryAPI.create({ text, date: format(date, 'yyyy-MM-dd'), tag_ids })
            .then(_ => {
                getJournals();
            })
            .catch((err: AxiosError) => {
                if (err.status === 409) {
                    console.error((err.response as AxiosResponse).data.error);
                }
            });
    };

    const updateDiary = (id: string, text: string | null, date: Date, tag_ids: string[], update_keys: DiaryKey[]) => {
        DiaryAPI.update(id, { text, date: format(date, 'yyyy-MM-dd'), tag_ids, update_keys })
            .then(_ => {
                getJournals();
            })
            .catch((err: AxiosError) => {
                if (err.status === 409) {
                    console.error((err.response as AxiosResponse).data.error);
                }
            });
    };

    const deleteDiary = (id: string) => {
        DiaryAPI.delete(id).then(_ => {
            getJournals();
        });
    };

    return {
        createDiary,
        updateDiary,
        deleteDiary,
    };
};

export default useDiaryAPI;
