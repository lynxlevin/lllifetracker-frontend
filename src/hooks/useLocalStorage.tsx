export interface AggregationBarGraphMax {
    [actionId: string]: { count?: number; duration?: number };
}

const LOCAL_STORAGE_KEYS = {
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
    aggregationSelectedActionId: 'aggregationSelectedActionId',
    aggregationBarGraphMax: 'aggregationBarGraphMax',
};

const useLocalStorage = () => {
    const setActionTracksColumnsCount = (columnsCount: number) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount, String(columnsCount));
    };

    const getActionTracksColumnsCount = (): 1 | 2 | 3 => {
        const value = localStorage.getItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount);
        if (value === '2') return 2;
        if (value === '3') return 3;
        return 1;
    };

    const setAggregationActionId = (actionId: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.aggregationSelectedActionId, actionId);
    };

    const getAggregationActionId = () => {
        const res = localStorage.getItem(LOCAL_STORAGE_KEYS.aggregationSelectedActionId);
        return res === '' ? null : res;
    };

    const setAggregationBarGraphMax = (barGraphMax: AggregationBarGraphMax) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.aggregationBarGraphMax, JSON.stringify(barGraphMax));
    };

    const getAggregationBarGraphMax = (): AggregationBarGraphMax => {
        const res = localStorage.getItem(LOCAL_STORAGE_KEYS.aggregationBarGraphMax);
        if (res === '' || res === null) return {};
        return JSON.parse(res) as AggregationBarGraphMax;
    };

    return {
        setActionTracksColumnsCount,
        getActionTracksColumnsCount,
        setAggregationActionId,
        getAggregationActionId,
        setAggregationBarGraphMax,
        getAggregationBarGraphMax,
    };
};

export default useLocalStorage;
