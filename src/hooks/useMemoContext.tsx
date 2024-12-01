import { useCallback, useContext, useState } from 'react';
import { MemoAPI } from '../apis/MemoAPI';
import { MemoContext } from '../contexts/memo-context';

const useMemoContext = () => {
    const memoContext = useContext(MemoContext);

    const [isLoading, setIsLoading] = useState(false);

    const memos = memoContext.memoList;
    const clearMemosCache = () => {
        memoContext.setMemoList(undefined);
    };

    const getMemos = useCallback(() => {
        setIsLoading(true);
        MemoAPI.list()
            .then(res => {
                memoContext.setMemoList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [memoContext]);

    return {
        isLoading,
        memos,
        clearMemosCache,
        getMemos,
    };
};

export default useMemoContext;
