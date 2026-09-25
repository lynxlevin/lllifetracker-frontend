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

export interface ActionsDisplayMode {
    archivedItems: 'Show' | 'Hide';
    tracksColumnsCount: 1 | 2 | 3;
}
const defaultActionsDisplayMode: ActionsDisplayMode = {
    archivedItems: 'Hide',
    tracksColumnsCount: 1,
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
    actionsDisplayMode: 'actionsDisplayMode',
    journalsDisplayMode: 'journalsDisplayMode',
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
    aggregationSelectedActionId: 'aggregationSelectedActionId',
    aggregationBarGraphMax: 'aggregationBarGraphMax',
};

const useLocalStorage = () => {
    const [ambitionsDisplayModeInner, setAmbitionsDisplayModeInner] = useState<AmbitionsDisplayMode>();
    const [directionsDisplayModeInner, setDirectionsDisplayModeInner] = useState<DirectionsDisplayMode>();
    const [actionsDisplayModeInner, setActionsDisplayModeInner] = useState<ActionsDisplayMode>();
    const [journalsDisplayModeInner, setJournalsDisplayModeInner] = useState<JournalsDisplayMode>();
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

    const setActionsDisplayMode = (displayMode: ActionsDisplayMode) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.actionsDisplayMode, JSON.stringify(displayMode));
        setActionsDisplayModeInner(displayMode);
    };

    const setJournalsDisplayMode = (displayMode: JournalsDisplayMode) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.journalsDisplayMode, JSON.stringify(displayMode));
        setJournalsDisplayModeInner(displayMode);
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
        if (actionsDisplayModeInner === undefined) {
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.actionsDisplayMode);
            setActionsDisplayModeInner(value === '' || value === null ? defaultActionsDisplayMode : (JSON.parse(value) as ActionsDisplayMode));
        }
        if (journalsDisplayModeInner === undefined) {
            const value = localStorage.getItem(LOCAL_STORAGE_KEYS.journalsDisplayMode);
            setJournalsDisplayModeInner(value === '' || value === null ? defaultJournalsDisplayMode : (JSON.parse(value) as JournalsDisplayMode));
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
        actionsDisplayMode: actionsDisplayModeInner ?? defaultActionsDisplayMode,
        setActionsDisplayMode,
        journalsDisplayMode: journalsDisplayModeInner ?? defaultJournalsDisplayMode,
        setJournalsDisplayMode,
        aggregationActionId: aggregationActionIdInner,
        setAggregationActionId,
        aggregationBarGraphMax: aggregationBarGraphMaxInner,
        setAggregationBarGraphMax,
    };
};

export default useLocalStorage;
