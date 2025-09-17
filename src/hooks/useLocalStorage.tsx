import { useEffect, useState } from 'react';

export interface AggregationBarGraphMax {
    [actionId: string]: { count?: number; duration?: number };
}

const LOCAL_STORAGE_KEYS = {
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
    aggregationSelectedActionId: 'aggregationSelectedActionId',
    aggregationBarGraphMax: 'aggregationBarGraphMax',
    itemIdsToHide: 'itemIdsToHide',
};

const useLocalStorage = () => {
    // MYMEMO: Make these contexts, or they always return undefined.
    const [actionTracksColumnsCountInner, setActionTracksColumnsCountInner] = useState<1 | 2 | 3>();
    const [aggregationActionIdInner, setAggregationActionIdInner] = useState<string | null>();
    const [aggregationBarGraphMaxInner, setAggregationBarGraphMaxInner] = useState<AggregationBarGraphMax>();
    const [itemIdsToHideInner, setItemIdsToHideInner] = useState<string[]>();

    const setActionTracksColumnsCount = (columnsCount: 1 | 2 | 3) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount, String(columnsCount));
        setActionTracksColumnsCountInner(columnsCount);
    };

    const setAggregationActionId = (actionId: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.aggregationSelectedActionId, actionId);
        setAggregationActionIdInner(actionId);
    };

    const setAggregationBarGraphMax = (barGraphMax: AggregationBarGraphMax) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.aggregationBarGraphMax, JSON.stringify(barGraphMax));
        setAggregationBarGraphMaxInner(barGraphMax);
    };

    const setItemIdsToHide = (ids: string[]) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.itemIdsToHide, JSON.stringify(ids));
        setItemIdsToHideInner(ids);
    };

    useEffect(() => {
        if (actionTracksColumnsCountInner === undefined) {
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount);
            switch (value) {
                case '2':
                    setActionTracksColumnsCountInner(2);
                    break;
                case '3':
                    setActionTracksColumnsCountInner(3);
                    break;
                default:
                    setActionTracksColumnsCountInner(1);
            }
        }
        if (aggregationActionIdInner === undefined) {
            const res = localStorage.getItem(LOCAL_STORAGE_KEYS.aggregationSelectedActionId);
            setAggregationActionIdInner(res === '' ? null : res);
        }
        if (aggregationBarGraphMaxInner === undefined) {
            const res = localStorage.getItem(LOCAL_STORAGE_KEYS.aggregationBarGraphMax);
            setAggregationBarGraphMaxInner(res === '' || res === null ? {} : JSON.parse(res));
        }
        if (itemIdsToHideInner === undefined) {
            const res = localStorage.getItem(LOCAL_STORAGE_KEYS.itemIdsToHide);
            setItemIdsToHideInner(res === '' || res === null ? [] : (JSON.parse(res) as string[]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        actionTracksColumnsCount: actionTracksColumnsCountInner ?? 1,
        setActionTracksColumnsCount,
        aggregationActionId: aggregationActionIdInner,
        setAggregationActionId,
        aggregationBarGraphMax: aggregationBarGraphMaxInner,
        setAggregationBarGraphMax,
        itemIdsToHide: itemIdsToHideInner,
        setItemIdsToHide,
    };
};

export default useLocalStorage;
