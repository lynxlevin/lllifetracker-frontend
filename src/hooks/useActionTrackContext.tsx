import { useContext, useState } from 'react';
import { ActionTrackAPI } from '../apis/ActionTrackAPI';
import { ActionTrackContext, SetActionTrackContext } from '../contexts/action-track-context';
import type { ActionTrack } from '../types/action_track';
import type { AxiosError } from 'axios';
import type { Action } from '../types/my_way';

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

    const getDailyAggregations = (yearMonths: number[]) => {
        console.log(yearMonths);
        setActionTrackContext.setDailyAggregation({
            '202506': [
                {
                    aggregation: [
                        {
                            action_id: '044414ce-c123-48be-b053-48f30872d058',
                            duration: 13712,
                            count: 8,
                        },
                        {
                            action_id: '594c89dc-7855-4c1c-be45-c17763094ebe',
                            duration: 4185,
                            count: 3,
                        },
                        {
                            action_id: '64b723ad-aa99-47a3-b92d-d95bbc816598',
                            duration: 0,
                            count: 2,
                        },
                        {
                            action_id: 'd8762df8-bd29-4883-b908-4ccafaac0383',
                            duration: 1791,
                            count: 2,
                        },
                        {
                            action_id: 'ed267f53-3db6-4ec6-b298-d15b4b28cf4e',
                            duration: 2306,
                            count: 8,
                        },
                    ],
                    date: 30,
                },
                {
                    aggregation: [
                        {
                            action_id: '01962792-03c6-7900-9189-bd12ae60cb38',
                            duration: 0,
                            count: 1,
                        },
                        {
                            action_id: '04ef7596-2cd3-45e6-9756-95f61cd754da',
                            duration: 3436,
                            count: 3,
                        },
                        {
                            action_id: '594c89dc-7855-4c1c-be45-c17763094ebe',
                            duration: 7245,
                            count: 3,
                        },
                        {
                            action_id: '64b723ad-aa99-47a3-b92d-d95bbc816598',
                            duration: 0,
                            count: 1,
                        },
                        {
                            action_id: 'ed267f53-3db6-4ec6-b298-d15b4b28cf4e',
                            duration: 569,
                            count: 3,
                        },
                    ],
                    date: 29,
                },
            ],
            '202507': [
                {
                    aggregation: [
                        {
                            action_id: '044414ce-c123-48be-b053-48f30872d058',
                            duration: 13712,
                            count: 8,
                        },
                        {
                            action_id: '594c89dc-7855-4c1c-be45-c17763094ebe',
                            duration: 4185,
                            count: 3,
                        },
                        {
                            action_id: '64b723ad-aa99-47a3-b92d-d95bbc816598',
                            duration: 0,
                            count: 2,
                        },
                        {
                            action_id: 'd8762df8-bd29-4883-b908-4ccafaac0383',
                            duration: 1791,
                            count: 2,
                        },
                        {
                            action_id: 'ed267f53-3db6-4ec6-b298-d15b4b28cf4e',
                            duration: 2306,
                            count: 8,
                        },
                    ],
                    date: 2,
                },
                {
                    aggregation: [
                        {
                            action_id: '01962792-03c6-7900-9189-bd12ae60cb38',
                            duration: 0,
                            count: 1,
                        },
                        {
                            action_id: '04ef7596-2cd3-45e6-9756-95f61cd754da',
                            duration: 3436,
                            count: 3,
                        },
                        {
                            action_id: '594c89dc-7855-4c1c-be45-c17763094ebe',
                            duration: 7245,
                            count: 3,
                        },
                        {
                            action_id: '64b723ad-aa99-47a3-b92d-d95bbc816598',
                            duration: 0,
                            count: 1,
                        },
                        {
                            action_id: 'ed267f53-3db6-4ec6-b298-d15b4b28cf4e',
                            duration: 569,
                            count: 3,
                        },
                    ],
                    date: 1,
                },
            ],
        });
        // setIsLoading(true);
        // const promises = yearMonths.map(yearMonth => ActionTrackAPI.dailyAggregation({ year_month: yearMonth }));
        // Promise.all(promises)
        //     .then(values => {
        //         setActionTrackContext.setDailyAggregation(prev => {
        //             let toBe = {};
        //             if (prev !== undefined) toBe = { ...prev };
        //             for (const value of values) {
        //                 toBe = { ...toBe, ...value.data };
        //             }
        //             return toBe;
        //         });
        //     })
        //     .catch(e => {
        //         console.error(e);
        //     })
        //     .finally(() => {
        //         setIsLoading(false);
        //     });
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
        });
    };

    const startTracking = (action: Action, setBooleanState: React.Dispatch<React.SetStateAction<boolean>>) => {
        setBooleanState(true);
        ActionTrackAPI.create({
            started_at: new Date().toISOString(),
            action_id: action.id,
        })
            .then(_ => {
                ActionTrackAPI.list(true)
                    .then(res => {
                        setActionTrackContext.setActiveActionTrackList(res.data);
                    })
                    .catch(e => {
                        console.error(e);
                    });
                if (action.track_type === 'Count') {
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

                    ActionTrackAPI.list(false, startedAtGte)
                        .then(res => {
                            setActionTrackContext.setActionTracksForTheDay(res.data);
                        })
                        .catch(e => console.error(e));
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
        aggregationForTheDay,
        dailyAggregation,
        clearActionTracksCache,
        // clearAggregationCache,
        getActionTracks,
        getDailyAggregations,
        updateActionTrack,
        deleteActionTrack,
        startTracking,
        stopTracking,
        stopTrackingWithState,
    };
};

export default useActionTrackContext;
