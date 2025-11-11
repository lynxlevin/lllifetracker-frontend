import { useEffect, useState } from 'react';

export type AmbitionsDisplayMode = 'Full' | 'TitleOnly';
export interface AggregationBarGraphMax {
    [actionId: string]: { count?: number; duration?: number };
}

const LOCAL_STORAGE_KEYS = {
    ambitionsDisplayMode: 'ambitionsDisplayMode',
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
    aggregationSelectedActionId: 'aggregationSelectedActionId',
    aggregationBarGraphMax: 'aggregationBarGraphMax',
};

const useLocalStorage = () => {
    const [ambitionsDisplayModeInner, setAmbitionsDisplayModeInner] = useState<AmbitionsDisplayMode>();
    const [actionTracksColumnsCountInner, setActionTracksColumnsCountInner] = useState<1 | 2 | 3>();
    const [aggregationActionIdInner, setAggregationActionIdInner] = useState<string | null>();
    const [aggregationBarGraphMaxInner, setAggregationBarGraphMaxInner] = useState<AggregationBarGraphMax>();

    const setAmbitionsDisplayMode = (displayMode: AmbitionsDisplayMode) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ambitionsDisplayMode, displayMode);
        setAmbitionsDisplayModeInner(displayMode);
    };

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

    useEffect(() => {
        if (ambitionsDisplayModeInner === undefined) {
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.ambitionsDisplayMode);
            setAmbitionsDisplayModeInner(value === '' || value === null ? 'Full' : (value as AmbitionsDisplayMode));
        }
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
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.aggregationSelectedActionId);
            setAggregationActionIdInner(value === '' ? null : value);
        }
        if (aggregationBarGraphMaxInner === undefined) {
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.aggregationBarGraphMax);
            setAggregationBarGraphMaxInner(value === '' || value === null ? {} : JSON.parse(value));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        ambitionsDisplayMode: ambitionsDisplayModeInner ?? 'Full',
        setAmbitionsDisplayMode,
        actionTracksColumnsCount: actionTracksColumnsCountInner ?? 1,
        setActionTracksColumnsCount,
        aggregationActionId: aggregationActionIdInner,
        setAggregationActionId,
        aggregationBarGraphMax: aggregationBarGraphMaxInner,
        setAggregationBarGraphMax,
    };
};

export default useLocalStorage;
