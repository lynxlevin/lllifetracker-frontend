import { useCallback, useContext, useState } from 'react';
import { ActionTrackAPI } from '../apis/ActionTrackAPI';
import { ActionTrackContext, SetActionTrackContext } from '../contexts/action-track-context';
import type { ActionTrack } from '../types/action_track';
import type { AxiosError } from 'axios';
import type { Action } from '../types/my_way';
import { endOfDay, startOfDay } from 'date-fns';

const useActionTrackContext = () => {
    const actionTrackContext = useContext(ActionTrackContext);
    const setActionTrackContext = useContext(SetActionTrackContext);

    const [isLoading, setIsLoading] = useState(false);

    const activeActionTracks = actionTrackContext.activeActionTrackList;
    const actionTracksForTheDay = actionTrackContext.actionTracksForTheDay;
    const aggregationForTheDay = actionTrackContext.aggregationForTheDay;
    const dailyAggregation = actionTrackContext.dailyAggregation;

    const clearActionTracksCache = () => {
        setActionTrackContext.setActiveActionTrackList(undefined);
        setActionTrackContext.setActionTracksForTheDay(undefined);
        setActionTrackContext.setAggregationForTheDay(undefined);
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
        const aggregationForTheDayPromise = ActionTrackAPI.aggregation({ range: { from: startedAtGte, to: startedAtLte } });
        Promise.all([actionTrackForTheDayPromise, activeActionTrackPromise, aggregationForTheDayPromise])
            .then(values => {
                setActionTrackContext.setActionTracksForTheDay(values[0].data);
                setActionTrackContext.setActiveActionTrackList(values[1].data);
                setActionTrackContext.setAggregationForTheDay(values[2].data);
            })
            .catch(e => {
                console.error(e);
            })
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
            .catch(e => {
                console.error(e);
            })
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
    const addTrackToAggregationForTheDay = (actionId: string, duration: number) => {
        setActionTrackContext.setAggregationForTheDay(prev => {
            const index = prev!.durations_by_action.findIndex(item => item.action_id === actionId);
            if (index === -1) {
                return {
                    durations_by_action: [...prev!.durations_by_action, { action_id: actionId, duration, count: 1 }],
                };
            } else {
                const toBe = [...prev!.durations_by_action];
                const target = prev!.durations_by_action[index];
                toBe[index] = { action_id: actionId, duration: target.duration + duration, count: target.count + 1 };
                return { durations_by_action: toBe };
            }
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

    const updateActionTrack = (id: string, startedAt: Date, endedAt: Date | null, action_id: string | null) => {
        ActionTrackAPI.update(id, { started_at: startedAt.toISOString(), ended_at: endedAt === null ? null : endedAt.toISOString(), action_id })
            .then(_ => {
                getActionTracks();
            })
            .catch((e: AxiosError) => {
                if (e.status === 409) {
                    // FIXME: handle this error when a common error handling is introduced.
                    console.log('conflict');
                    return;
                }
                throw e;
            });
    };

    const deleteActionTrack = (actionTrack: ActionTrack) => {
        ActionTrackAPI.delete(actionTrack.id).then(_ => {
            if ([activeActionTracks, actionTracksForTheDay, aggregationForTheDay].some(item => item === undefined)) {
                getActionTracks();
            } else {
                if (actionTrack.duration !== null) {
                    setActionTrackContext.setActionTracksForTheDay(prev => {
                        const toBe = [...prev!];
                        const index = prev!.findIndex(item => item.id === actionTrack.id);
                        if (index > -1) toBe.splice(index, 1);
                        return toBe;
                    });
                    setActionTrackContext.setAggregationForTheDay(prev => {
                        const index = prev!.durations_by_action.findIndex(item => item.action_id === actionTrack.action_id);
                        if (index === -1) {
                            return { durations_by_action: [...prev!.durations_by_action] };
                        } else {
                            const toBe = [...prev!.durations_by_action];
                            const target = prev!.durations_by_action[index];
                            toBe[index] = {
                                action_id: actionTrack.action_id,
                                duration: target.duration - (actionTrack.duration ?? 0),
                                count: target.count - 1,
                            };
                            return { durations_by_action: toBe };
                        }
                    });
                } else {
                    removeTrackFromActiveActionTrackList(actionTrack.id);
                }
            }
            clearAggregationCache();
        });
    };

    const startTracking = (action: Action, setBooleanState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setBooleanState(true);
        const startedAt = new Date().toISOString();
        ActionTrackAPI.create({
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
                        if ([aggregationForTheDay, actionTracksForTheDay].some(item => item === undefined)) {
                            getActionTracks();
                        } else {
                            addTrackToAggregationForTheDay(action.id, 0);
                            addTrackToActionTracksForTheDay(newTrack);
                        }
                        clearAggregationCache();
                }
            })
            .catch((e: AxiosError) => {
                if (e.status === 409) {
                    console.log(e.message);
                } else {
                    throw e;
                }
            })
            .finally(() => {
                setBooleanState(false);
            });
    };

    const refreshTracking = (actionTrack: ActionTrack) => {
        ActionTrackAPI.update(actionTrack.id, { started_at: new Date().toISOString(), ended_at: null, action_id: actionTrack.action_id })
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
            .catch((e: AxiosError) => {
                if (e.status === 409) {
                    // FIXME: handle this error when a common error handling is introduced.
                    console.log('conflict');
                    return;
                }
                throw e;
            });
    };

    const stopTracking = (actionTrack: ActionTrack, setBooleanState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setBooleanState(true);
        const ended_at = new Date().toISOString();
        const action_id = actionTrack.action_id;
        ActionTrackAPI.update(actionTrack.id, {
            started_at: actionTrack.started_at,
            ended_at,
            action_id,
        }).then(res => {
            const newTrack = res.data;
            if ([activeActionTracks, actionTracksForTheDay, aggregationForTheDay].some(item => item === undefined)) {
                getActionTracks();
            } else {
                removeTrackFromActiveActionTrackList(actionTrack.id);
                addTrackToActionTracksForTheDay(newTrack);
                addTrackToAggregationForTheDay(actionTrack.action_id, newTrack.duration ?? 0);
            }
            setBooleanState(false);
            clearAggregationCache();
        });
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
        aggregationForTheDay,
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
