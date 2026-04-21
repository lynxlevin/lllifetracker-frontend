import { useEffect, useState } from 'react';

export interface AmbitionsDisplayMode {
    item: 'Full' | 'TitleOnly';
    archivedItems: 'Show' | 'Hide';
}
const defaultAmbitionsDisplayMode: AmbitionsDisplayMode = {
    item: 'Full',
    archivedItems: 'Hide',
};

export interface DirectionsDisplayMode {
    item: 'Full' | 'TitleOnly';
    archivedItems: 'Show' | 'Hide';
}
const defaultDirectionsDisplayMode: DirectionsDisplayMode = {
    item: 'Full',
    archivedItems: 'Hide',
};

export interface JournalsDisplayMode {
    item: 'Full' | 'Abbreviated';
}
const defaultJournalsDisplayMode: JournalsDisplayMode = {
    item: 'Abbreviated',
};
export interface AggregationBarGraphMax {
    [actionId: string]: { count?: number; duration?: number };
}

const LOCAL_STORAGE_KEYS = {
    ambitionsDisplayMode: 'ambitionsDisplayMode2',
    directionsDisplayMode: 'directionsDisplayMode',
    journalsDisplayMode: 'journalsDisplayMode',
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
    aggregationSelectedActionId: 'aggregationSelectedActionId',
    aggregationBarGraphMax: 'aggregationBarGraphMax',
};

const useLocalStorage = () => {
    const [ambitionsDisplayModeInner, setAmbitionsDisplayModeInner] = useState<AmbitionsDisplayMode>();
    const [directionsDisplayModeInner, setDirectionsDisplayModeInner] = useState<DirectionsDisplayMode>();
    const [journalsDisplayModeInner, setJournalsDisplayModeInner] = useState<JournalsDisplayMode>();
    const [actionTracksColumnsCountInner, setActionTracksColumnsCountInner] = useState<1 | 2 | 3>();
    const [aggregationActionIdInner, setAggregationActionIdInner] = useState<string | null>();
    const [aggregationBarGraphMaxInner, setAggregationBarGraphMaxInner] = useState<AggregationBarGraphMax>();

    const setAmbitionsDisplayMode = (displayMode: AmbitionsDisplayMode) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.ambitionsDisplayMode, JSON.stringify(displayMode));
        setAmbitionsDisplayModeInner(displayMode);
    };

    const setDirectionsDisplayMode = (displayMode: DirectionsDisplayMode) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.directionsDisplayMode, JSON.stringify(displayMode));
        setDirectionsDisplayModeInner(displayMode);
    };

    const setJournalsDisplayMode = (displayMode: JournalsDisplayMode) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.journalsDisplayMode, JSON.stringify(displayMode));
        setJournalsDisplayModeInner(displayMode);
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
            setAmbitionsDisplayModeInner(value === '' || value === null ? defaultAmbitionsDisplayMode : (JSON.parse(value) as AmbitionsDisplayMode));
        }
        if (directionsDisplayModeInner === undefined) {
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.directionsDisplayMode);
            setDirectionsDisplayModeInner(value === '' || value === null ? defaultDirectionsDisplayMode : (JSON.parse(value) as DirectionsDisplayMode));
        }
        if (journalsDisplayModeInner === undefined) {
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.journalsDisplayMode);
            setJournalsDisplayModeInner(value === '' || value === null ? defaultJournalsDisplayMode : (JSON.parse(value) as JournalsDisplayMode));
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
        ambitionsDisplayMode: ambitionsDisplayModeInner ?? defaultAmbitionsDisplayMode,
        setAmbitionsDisplayMode,
        directionsDisplayMode: directionsDisplayModeInner ?? defaultDirectionsDisplayMode,
        setDirectionsDisplayMode,
        journalsDisplayMode: journalsDisplayModeInner ?? defaultJournalsDisplayMode,
        setJournalsDisplayMode,
        actionTracksColumnsCount: actionTracksColumnsCountInner ?? 1,
        setActionTracksColumnsCount,
        aggregationActionId: aggregationActionIdInner,
        setAggregationActionId,
        aggregationBarGraphMax: aggregationBarGraphMaxInner,
        setAggregationBarGraphMax,
    };
};

export default useLocalStorage;
