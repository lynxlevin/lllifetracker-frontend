import { Box, Stack, Typography, IconButton, type SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, startOfWeek, endOfWeek, differenceInCalendarDays } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';
import useLocalStorage, { type AggregationBarGraphMax } from '../../hooks/useLocalStorage';
import AggregationsBarGraph from './components/AggregationsBarGraph';
import { getDurationString } from '../../hooks/useValueDisplay';
import ActionRadios from './components/ActionRadios';

const WeeklyAggregations = () => {
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();
    const {
        getAggregationActionId: getLocalStorageActionId,
        setAggregationActionId: setLocalStorageActionId,
        getAggregationBarGraphMax,
        setAggregationBarGraphMax,
    } = useLocalStorage();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAction, setSelectedAction] = useState<Action>();
    const [barGraphMax, setBarGraphMax] = useState<AggregationBarGraphMax>(getAggregationBarGraphMax());

    const selectAction = (event: SelectChangeEvent<string>) => {
        setSelectedAction(actions?.find(action => action.id === event.target.value));
        setLocalStorageActionId(event.target.value);
    };

    const daysForSelectedWeek = useMemo(() => {
        const start = startOfWeek(selectedDate);
        return [
            start,
            add(start, { days: 1 }),
            add(start, { days: 2 }),
            add(start, { days: 3 }),
            add(start, { days: 4 }),
            add(start, { days: 5 }),
            add(start, { days: 6 }),
        ];
    }, [selectedDate]);

    const selectedWeekAggregationByDay = useMemo(() => {
        if (dailyAggregation === undefined) return [];

        const res: DurationsByAction[][] = [];
        for (const day of daysForSelectedWeek) {
            const selectedMonthAgg = findMonthFromDailyAggregation(day);
            if (selectedMonthAgg === undefined) continue;
            const selectedDateAgg = selectedMonthAgg.find(date => date.date === day.getDate());
            if (selectedDateAgg === undefined) {
                res.push([]);
                continue;
            }
            res.push(selectedDateAgg.aggregation);
        }
        return res;
    }, [dailyAggregation, daysForSelectedWeek, findMonthFromDailyAggregation]);

    const selectedWeekAggregationTotal = useMemo(() => {
        if (dailyAggregation === undefined) return undefined;

        const res: DurationsByAction[] = [];
        for (const dateAgg of selectedWeekAggregationByDay) {
            for (const agg of dateAgg) {
                const target = res.find(item => item.action_id === agg.action_id);
                if (target === undefined) {
                    res.push({ ...agg });
                } else {
                    target.duration += agg.duration;
                    target.count += agg.count;
                }
            }
        }
        return res.length === 0 ? undefined : res;
    }, [dailyAggregation, selectedWeekAggregationByDay]);

    useEffect(() => {
        if (actions === undefined) return;
        if (selectedAction !== undefined) return;
        const localStorageActionId = getLocalStorageActionId();
        const localStorageAction = actions.find(action => action.id === localStorageActionId);
        if (localStorageAction !== undefined) {
            setSelectedAction(localStorageAction);
        } else {
            setSelectedAction(actions[0]);
        }
    }, [actions, getLocalStorageActionId, selectedAction]);
    useEffect(() => {
        const start = startOfWeek(selectedDate);
        const end = endOfWeek(selectedDate);
        const target = [];
        if (findMonthFromDailyAggregation(start) === undefined) target.push(start);
        if (end.getMonth() !== start.getMonth() && findMonthFromDailyAggregation(end) === undefined) target.push(end);
        getDailyAggregations(target);
        // actions is for re-triggering after cacheClear. Assigning dailyAggregation results in infinite loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, actions]);
    useEffect(() => {
        if (actions === undefined && !isLoadingActions) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage pageName='Aggregation'>
            <Box sx={{ pt: 4 }}>
                <Stack direction='row' justifyContent='center' alignItems='center'>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return sub(prev, { weeks: 1 });
                            });
                        }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Button onClick={() => setSelectedDate(new Date())}>
                        <Typography variant='body1' color='rgba(0, 0, 0, 0.87)'>
                            {format(startOfWeek(selectedDate), 'yyyy-MM-dd E')} -{' '}
                            {format(
                                endOfWeek(selectedDate),
                                endOfWeek(selectedDate).getFullYear() !== startOfWeek(selectedDate).getFullYear() ? 'yyyy-MM-dd E' : 'MM-dd E',
                            )}
                        </Typography>
                    </Button>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return add(prev, { weeks: 1 });
                            });
                        }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ mt: 1 }}>
                    {selectedAction === undefined ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        <>
                            <ActionRadios selectedAction={selectedAction} actions={actions} selectAction={selectAction} />
                            <ItemTotal
                                durationByAction={selectedWeekAggregationTotal?.find(agg => agg.action_id === selectedAction.id)}
                                selectedAction={selectedAction}
                                daysCount={Math.min(
                                    differenceInCalendarDays(endOfWeek(selectedDate), startOfWeek(selectedDate)) + 1,
                                    differenceInCalendarDays(new Date(), startOfWeek(selectedDate)) + 1,
                                )}
                            />
                            <AggregationsBarGraph
                                aggregationByDay={selectedWeekAggregationByDay.slice(0, 15)}
                                days={daysForSelectedWeek.slice(0, 15)}
                                selectedAction={selectedAction}
                                barGraphMax={barGraphMax}
                                setBarGraphMax={(max: AggregationBarGraphMax) => {
                                    setBarGraphMax(max);
                                    setAggregationBarGraphMax(max);
                                }}
                            />
                        </>
                    )}
                </Box>
            </Box>
        </BasePage>
    );
};

const ItemTotal = ({ durationByAction, selectedAction, daysCount }: { durationByAction?: DurationsByAction; selectedAction: Action; daysCount: number }) => {
    const value = selectedAction.track_type === 'TimeSpan' ? durationByAction?.duration : durationByAction?.count;
    const getDisplayValue = (num?: number) => {
        if (selectedAction.track_type === 'TimeSpan') return getDurationString(num) ?? '-';
        if (num === undefined || num === 0) return '-';
        return Math.floor(num * 100) / 100;
    };

    return (
        <Stack direction='row' justifyContent='space-between' mt={2}>
            <Typography variant='body2'>合計:{getDisplayValue(value)}</Typography>
            <Typography variant='body2'>1日平均:{value && getDisplayValue(value / daysCount)}</Typography>
            <Typography variant='body2'>
                1回平均:{value && selectedAction.track_type === 'TimeSpan' && getDisplayValue(value / durationByAction!.count)}
            </Typography>
        </Stack>
    );
};

export default WeeklyAggregations;
