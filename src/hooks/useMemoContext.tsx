import { useCallback, useContext, useState } from 'react';
import { MemoAPI } from '../apis/MemoAPI';
import { MemoContext, SetMemoContext } from '../contexts/memo-context';
import { format } from 'date-fns';

const useMemoContext = () => {
    const memoContext = useContext(MemoContext);
    const setMemoContext = useContext(SetMemoContext);

    const [isLoading, setIsLoading] = useState(false);

    const memos = memoContext.memoList;
    const clearMemosCache = () => {
        setMemoContext.setMemoList(undefined);
    };

    const getMemos = useCallback(() => {
        setIsLoading(true);
        MemoAPI.list()
            .then(res => {
                setMemoContext.setMemoList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setMemoContext]);

    const createMemo = (title: string, text: string, date: Date, tag_ids: string[]) => {
        MemoAPI.create({ title, text, date: format(date, 'yyyy-MM-dd'), tag_ids }).then(_ => {
            getMemos();
        });
    };

    const updateMemo = (id: string, title: string, text: string, date: Date, favorite: boolean, tag_ids: string[]) => {
        MemoAPI.update(id, { title, text, date: format(date, 'yyyy-MM-dd'), favorite, tag_ids }).then(_ => {
            getMemos();
        });
    };

    const deleteMemo = (id: string) => {
        MemoAPI.delete(id).then(_ => {
            getMemos();
        });
    };

    return {
        isLoading,
        memos,
        clearMemosCache,
        getMemos,
        createMemo,
        updateMemo,
        deleteMemo,
    };
};

export default useMemoContext;
