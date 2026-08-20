import { useCallback, useContext, useState } from 'react';
import { ActionTrackAPI } from '../apis/ActionTrackAPI';
import { ActionTrackContext, SetActionTrackContext } from '../contexts/action-track-context';
import type { ActionTrack } from '../types/action_track';
import type { Action } from '../types/my_way';
import { endOfDay, startOfDay } from 'date-fns';
import useGlobalErrorContext from './useGlobalErrorContext';

const useActionTrackContext = () => {
    const actionTrackContext = useContext(ActionTrackContext);
    const setActionTrackContext = useContext(SetActionTrackContext);
    const { handleAPIError, handleAPIErrorThrowing } = useGlobalErrorContext();

    const [isLoading, setIsLoading] = useState(false);

    const activeActionTracks = actionTrackContext.activeActionTrackList;
    const actionTracksForTheDay = actionTrackContext.actionTracksForTheDay;
    const shouldRefreshActionTracksCache = actionTrackContext.shouldRefreshActionTracksCache;
    const dailyAggregation = actionTrackContext.dailyAggregation;

    const clearActionTracksCache = () => {
        setActionTrackContext.setActiveActionTrackList(undefined);
        setActionTrackContext.setActionTracksForTheDay(undefined);
    };

    const clearAggregationCache = () => {
        setActionTrackContext.setDailyAggregation(undefined);
    };

    const getActionTracks = () => {
        setIsLoading(true);
        const startedAtGte = startOfDay(new Date());
        const startedAtLte = endOfDay(new Date());

        const actionTrackForTheDayPromise = ActionTrackAPI.list({ startedAtGte, startedAtLte });
        const activeActionTrackPromise = ActionTrackAPI.list({ activeOnly: true });
        Promise.all([actionTrackForTheDayPromise, activeActionTrackPromise])
            .then(values => {
                setActionTrackContext.setActionTracksForTheDay(values[0].data);
                setActionTrackContext.setActiveActionTrackList(values[1].data);
            })
            .catch(handleAPIError)
            .finally(() => {
                setIsLoading(false);
            });
    };

    const getDailyAggregations = (dates: Date[]) => {
        setIsLoading(true);
        const yearMonths = dates.map(date => date.getFullYear() * 100 + date.getMonth() + 1);
        const promises = yearMonths.map(yearMonth => ActionTrackAPI.dailyAggregation({ year_month: yearMonth }));
        Promise.all(promises)
            .then(values => {
                setActionTrackContext.setDailyAggregation(prev => {
                    let toBe = {};
                    if (prev !== undefined) toBe = { ...prev };
                    for (const value of values) {
                        toBe = { ...toBe, ...value.data };
                    }
                    return toBe;
                });
            })
            .catch(handleAPIError)
            .finally(() => {
                setIsLoading(false);
            });
    };

    const cmpStartedAt = (a: ActionTrack, b: ActionTrack) => (a.started_at > b.started_at ? -1 : a.started_at < b.started_at ? 1 : 0);
    const addTrackToActionTracksForTheDay = (newTrack: ActionTrack) => {
        setActionTrackContext.setActionTracksForTheDay(prev => {
            const toBe = [newTrack, ...prev!];
            toBe.sort(cmpStartedAt);
            return toBe;
        });
    };
    const removeTrackFromActiveActionTrackList = (id: string) => {
        setActionTrackContext.setActiveActionTrackList(prev => {
            const toBe = [...prev!];
            const index = prev!.findIndex(item => item.id === id);
            if (index > -1) toBe.splice(index, 1);
            return toBe;
        });
    };

    const updateActionTrack = async (id: string, startedAt: Date, endedAt: Date | null, action_id: string | null) => {
        await ActionTrackAPI.update(id, { started_at: startedAt.toISOString(), ended_at: endedAt === null ? null : endedAt.toISOString(), action_id })
            .then(_ => {
                getActionTracks();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteActionTrack = async (actionTrack: ActionTrack) => {
        await ActionTrackAPI.delete(actionTrack.id)
            .then(_ => {
                if ([activeActionTracks, actionTracksForTheDay].some(item => item === undefined)) {
                    getActionTracks();
                } else {
                    if (actionTrack.duration !== null) {
                        setActionTrackContext.setActionTracksForTheDay(prev => {
                            const toBe = [...prev!];
                            const index = prev!.findIndex(item => item.id === actionTrack.id);
                            if (index > -1) toBe.splice(index, 1);
                            return toBe;
                        });
                    } else {
                        removeTrackFromActiveActionTrackList(actionTrack.id);
                    }
                }
                clearAggregationCache();
            })
            .catch(handleAPIErrorThrowing);
    };

    const startTracking = async (action: Action, setBooleanState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setBooleanState(true);
        const startedAt = new Date().toISOString();
        await ActionTrackAPI.create({
            started_at: startedAt,
            action_id: action.id,
        })
            .then(res => {
                const newTrack = res.data;
                switch (action.track_type) {
                    case 'TimeSpan':
                        if (activeActionTracks === undefined) {
                            getActionTracks();
                        } else {
                            setActionTrackContext.setActiveActionTrackList(prev => {
                                return [newTrack, ...prev!];
                            });
                        }
                        break;
                    case 'Count':
                        if (actionTracksForTheDay === undefined) {
                            getActionTracks();
                        } else {
                            addTrackToActionTracksForTheDay(newTrack);
                        }
                        clearAggregationCache();
                }
            })
            .catch(handleAPIErrorThrowing)
            .finally(() => {
                setBooleanState(false);
            });
    };

    const refreshTracking = async (actionTrack: ActionTrack) => {
        await ActionTrackAPI.update(actionTrack.id, { started_at: new Date().toISOString(), ended_at: null, action_id: actionTrack.action_id })
            .then(res => {
                const newTrack = res.data;
                if (activeActionTracks === undefined) {
                    getActionTracks();
                } else {
                    setActionTrackContext.setActiveActionTrackList(prev => {
                        const toBe = [...prev!];
                        const index = prev!.findIndex(item => item.id === actionTrack.id);
                        if (index > -1) toBe[index] = newTrack;
                        return toBe;
                    });
                }
            })
            .catch(handleAPIErrorThrowing);
    };

    const stopTracking = async (actionTrack: ActionTrack, setBooleanState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setBooleanState(true);
        const ended_at = new Date().toISOString();
        const action_id = actionTrack.action_id;
        await ActionTrackAPI.update(actionTrack.id, {
            started_at: actionTrack.started_at,
            ended_at,
            action_id,
        })
            .then(res => {
                const newTrack = res.data;
                if ([activeActionTracks, actionTracksForTheDay].some(item => item === undefined)) {
                    getActionTracks();
                } else {
                    removeTrackFromActiveActionTrackList(actionTrack.id);
                    addTrackToActionTracksForTheDay(newTrack);
                }
                setBooleanState(false);
                clearAggregationCache();
            })
            .catch(handleAPIErrorThrowing);
    };

    const findMonthFromDailyAggregation = useCallback(
        (day: Date) => {
            if (dailyAggregation === undefined) return undefined;
            return dailyAggregation[`${day.getFullYear() * 100 + day.getMonth() + 1}`];
        },
        [dailyAggregation],
    );

    return {
        isLoading,
        activeActionTracks,
        actionTracksForTheDay,
        shouldRefreshActionTracksCache,
        setShouldRefreshActionTracksCache: setActionTrackContext.setShouldRefreshActionTracksCache,
        dailyAggregation,
        clearActionTracksCache,
        clearAggregationCache,
        getActionTracks,
        getDailyAggregations,
        updateActionTrack,
        deleteActionTrack,
        startTracking,
        refreshTracking,
        stopTracking,
        findMonthFromDailyAggregation,
    };
};

export default useActionTrackContext;
