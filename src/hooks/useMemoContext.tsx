import { useCallback, useContext, useState } from 'react';
import { MemoAPI } from '../apis/MemoAPI';
import { MemoContext, SetMemoContext } from '../contexts/memo-context';
import { format } from 'date-fns';
import type { Memo } from '../types/memo';

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

    const switchMemoFavorite = (memo: Memo) => {
        const { title, text, date, favorite, tags } = memo;
        // MYMEMO: maybe better to send only favorite?
        MemoAPI.update(memo.id, { title, text, date, favorite: !favorite, tag_ids: tags.map(tag => tag.id) }).then(_ => {
            memo.favorite = !favorite;
            setMemoContext.setMemoList(prev => {
                const index = prev!.findIndex(item => item.id === memo.id);
                if (index === -1) return prev;
                return [...prev!.slice(0, index), memo, ...prev!.slice(index + 1)];
            });
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
        switchMemoFavorite,
        deleteMemo,
    };
};

export default useMemoContext;
