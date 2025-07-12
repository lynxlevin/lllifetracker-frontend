import { useCallback, useContext, useState } from 'react';
import { DiaryAPI } from '../apis/DiaryAPI';
import { DiaryContext, SetDiaryContext } from '../contexts/diary-context';
import { format } from 'date-fns';
import type { DiaryKey } from '../types/diary';
import type { AxiosError, AxiosResponse } from 'axios';

const useDiaryContext = () => {
    const diaryContext = useContext(DiaryContext);
    const setDiaryContext = useContext(SetDiaryContext);

    const [isLoading, setIsLoading] = useState(false);

    const diaries = diaryContext.diaryList;
    const clearDiariesCache = () => {
        setDiaryContext.setDiaryList(undefined);
    };

    const getDiaries = useCallback(() => {
        setIsLoading(true);
        DiaryAPI.list()
            .then(res => {
                setDiaryContext.setDiaryList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setDiaryContext]);

    const createDiary = (text: string | null, date: Date, tag_ids: string[]) => {
        DiaryAPI.create({ text, date: format(date, 'yyyy-MM-dd'), tag_ids })
            .then(_ => {
                getDiaries();
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
                getDiaries();
            })
            .catch((err: AxiosError) => {
                if (err.status === 409) {
                    console.error((err.response as AxiosResponse).data.error);
                }
            });
    };

    const deleteDiary = (id: string) => {
        DiaryAPI.delete(id).then(_ => {
            getDiaries();
        });
    };

    return {
        isLoading,
        diaries,
        clearDiariesCache,
        getDiaries,
        createDiary,
        updateDiary,
        deleteDiary,
    };
};

export default useDiaryContext;
