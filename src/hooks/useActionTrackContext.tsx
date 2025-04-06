import { useContext, useState } from 'react';
import { ActionTrackAPI } from '../apis/ActionTrackAPI';
import { ActionTrackContext, SetActionTrackContext } from '../contexts/action-track-context';
import type { ActionTrack } from '../types/action_track';

const useActionTrackContext = () => {
    const actionTrackContext = useContext(ActionTrackContext);
    const setActionTrackContext = useContext(SetActionTrackContext);

    const [isLoading, setIsLoading] = useState(false);

    const activeActionTracks = actionTrackContext.activeActionTrackList;
    const actionTracksForTheDay = actionTrackContext.actionTracksForTheDay;
    const dailyAggregation = actionTrackContext.dailyAggregation;

    const clearActionTracksCache = () => {
        setActionTrackContext.setActiveActionTrackList(undefined);
        setActionTrackContext.setActionTracksForTheDay(undefined);
        setActionTrackContext.setDailyAggregation(undefined);
    };

    const getActionTracks = () => {
        setIsLoading(true);
        const startedAtGte = new Date();
        startedAtGte.setHours(0);
        startedAtGte.setMinutes(0);
        startedAtGte.setSeconds(0);
        startedAtGte.setMilliseconds(0);
        const startedAtLte = new Date();
        startedAtLte.setHours(23);
        startedAtLte.setMinutes(59);
        startedAtLte.setSeconds(59);
        startedAtLte.setMilliseconds(999);

        const actionTrackForTheDayPromise = ActionTrackAPI.list(false, startedAtGte);
        const activeActionTrackPromise = ActionTrackAPI.list(true);
        const dailyAggregationPromise = ActionTrackAPI.aggregation(startedAtGte, startedAtLte);
        Promise.all([actionTrackForTheDayPromise, activeActionTrackPromise, dailyAggregationPromise])
            .then(values => {
                setActionTrackContext.setActionTracksForTheDay(values[0].data);
                setActionTrackContext.setActiveActionTrackList(values[1].data);
                setActionTrackContext.setDailyAggregation(values[2].data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const updateActionTrack = (id: string, startedAt: Date, endedAt: Date | null, action_id: string | null) => {
        ActionTrackAPI.update(id, { started_at: startedAt.toISOString(), ended_at: endedAt === null ? null : endedAt.toISOString(), action_id }).then(_ => {
            getActionTracks();
        });
    };

    const deleteActionTrack = (id: string) => {
        ActionTrackAPI.delete(id).then(_ => {
            getActionTracks();
        });
    };

    const startTracking = (actionId: string, setBooleanState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setBooleanState(true);
        ActionTrackAPI.create({
            started_at: new Date().toISOString(),
            action_id: actionId,
        }).then(_ => {
            setBooleanState(false);
            ActionTrackAPI.list(true)
                .then(res => {
                    setActionTrackContext.setActiveActionTrackList(res.data);
                })
                .catch(e => {
                    console.error(e);
                });
        });
    };

    const stopTracking = (actionTrack: ActionTrack) => {
        ActionTrackAPI.update(actionTrack.id, {
            started_at: actionTrack.started_at,
            ended_at: new Date().toISOString(),
            action_id: actionTrack.action_id,
        }).then(_ => {
            getActionTracks();
        });
    };

    const stopTrackingWithState = (actionTrack: ActionTrack, setBooleanState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setBooleanState(true);
        ActionTrackAPI.update(actionTrack.id, {
            started_at: actionTrack.started_at,
            ended_at: new Date().toISOString(),
            action_id: actionTrack.action_id,
        }).then(_ => {
            setBooleanState(false);
            getActionTracks();
        });
    };

    return {
        isLoading,
        activeActionTracks,
        actionTracksForTheDay,
        dailyAggregation,
        clearActionTracksCache,
        getActionTracks,
        updateActionTrack,
        deleteActionTrack,
        startTracking,
        stopTracking,
        stopTrackingWithState,
    };
};

export default useActionTrackContext;
