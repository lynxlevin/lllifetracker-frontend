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

    const deleteActionTrack = (id: string) => {
        ActionTrackAPI.delete(id).then(_ => {
            getActionTracks();
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
                const id = res.data.id;
                switch (action.track_type) {
                    case 'TimeSpan':
                        setActionTrackContext.setActiveActionTrackList(prev => {
                            if (prev === undefined) {
                                getActionTracks();
                            } else {
                                const newTrack = { id, action_id: action.id, started_at: startedAt, ended_at: null, duration: null };
                                return [newTrack, ...prev];
                            }
                        });
                        break;
                    case 'Count':
                        if (aggregationForTheDay === undefined || actionTracksForTheDay === undefined) {
                            getActionTracks();
                        } else {
                            setActionTrackContext.setAggregationForTheDay(prev => {
                                const index = prev!.durations_by_action.findIndex(item => item.action_id === action.id);
                                if (index === -1) {
                                    return {
                                        durations_by_action: [...prev!.durations_by_action, { action_id: action.id, duration: 0, count: 1 }],
                                    };
                                } else {
                                    const toBe = [...prev!.durations_by_action];
                                    const target = prev!.durations_by_action[index];
                                    toBe[index] = { action_id: action.id, duration: target.duration, count: target.count + 1 };
                                    return { durations_by_action: toBe };
                                }
                            });
                            setActionTrackContext.setActionTracksForTheDay(prev => {
                                const toBe = [{ id, action_id: action.id, started_at: startedAt, ended_at: startedAt, duration: 0 }, ...prev!];
                                toBe.sort((a, b) => (a.started_at > b.started_at ? -1 : a.started_at < b.started_at ? 1 : 0));
                                return toBe;
                            });
                        }
                }
            })
            .catch((e: AxiosError) => {
                if (e.status === 409) {
                    console.log(e.message);
                    return;
                }
                throw e;
            })
            .finally(() => {
                setBooleanState(false);
            });
    };

    const stopTracking = (actionTrack: ActionTrack) => {
        ActionTrackAPI.update(actionTrack.id, {
            started_at: actionTrack.started_at,
            ended_at: new Date().toISOString(),
            action_id: actionTrack.action_id,
        }).then(_ => {
            getActionTracks();
            clearAggregationCache();
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
        stopTracking,
        stopTrackingWithState,
        findMonthFromDailyAggregation,
    };
};

export default useActionTrackContext;
