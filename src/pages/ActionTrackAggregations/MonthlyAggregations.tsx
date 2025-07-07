import { Box, Stack, Typography, IconButton, Select, MenuItem, type SelectChangeEvent, CircularProgress, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, startOfMonth, endOfMonth, differenceInCalendarDays } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';
import useLocalStorage, { type AggregationBarGraphMax } from '../../hooks/useLocalStorage';
import AggregationsBarGraph from './components/AggregationsBarGraph';
import { getDurationString } from '../../hooks/useValueDisplay';

const MonthlyAggregations = () => {
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();
    const {
        getMonthlyAggSelectedActionId: getLocalStorageActionId,
        setMonthlyAggSelectedActionId: setLocalStorageActionId,
        setAggregationBarGraphMax,
        getAggregationBarGraphMax,
    } = useLocalStorage();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAction, setSelectedAction] = useState<Action>();
    const [barGraphMax, setBarGraphMax] = useState<AggregationBarGraphMax>(getAggregationBarGraphMax());

    const selectAction = (event: SelectChangeEvent<string>) => {
        setSelectedAction(actions?.find(action => action.id === event.target.value));
        setLocalStorageActionId(event.target.value);
    };

    const daysForSelectedMonth = useMemo(() => {
        const start = startOfMonth(selectedDate);
        const end = endOfMonth(selectedDate);

        const res = [start];
        for (let i = 1; i < end.getDate(); i++) {
            res.push(add(start, { days: i }));
        }
        return res;
    }, [selectedDate]);

    const selectedMonthAggregationByDay = useMemo(() => {
        if (dailyAggregation === undefined) return [];

        const res: DurationsByAction[][] = [];
        for (const day of daysForSelectedMonth) {
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
    }, [dailyAggregation, daysForSelectedMonth, findMonthFromDailyAggregation]);

    const selectedMonthAggregationTotal = useMemo(() => {
        if (dailyAggregation === undefined) return undefined;

        const res: DurationsByAction[] = [];
        for (const dateAgg of selectedMonthAggregationByDay) {
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
    }, [dailyAggregation, selectedMonthAggregationByDay]);

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
        if (findMonthFromDailyAggregation(selectedDate) === undefined) getDailyAggregations([selectedDate]);
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
                                return sub(prev, { months: 1 });
                            });
                        }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Button onClick={() => setSelectedDate(new Date())}>
                        <Typography variant='body1' color='rgba(0, 0, 0, 0.87)'>
                            {format(startOfMonth(selectedDate), 'yyyy-MM')}
                        </Typography>
                    </Button>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return add(prev, { months: 1 });
                            });
                        }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    {selectedAction === undefined ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        <>
                            <Select value={selectedAction.id} onChange={selectAction}>
                                {actions?.map(action => (
                                    <MenuItem key={action.id} value={action.id}>
                                        {action.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            <ItemTotal
                                durationByAction={selectedMonthAggregationTotal?.find(agg => agg.action_id === selectedAction.id)}
                                selectedAction={selectedAction}
                                daysCount={Math.min(
                                    differenceInCalendarDays(endOfMonth(selectedDate), startOfMonth(selectedDate)) + 1,
                                    differenceInCalendarDays(new Date(), startOfMonth(selectedDate)) + 1,
                                )}
                            />
                            <AggregationsBarGraph
                                aggregationByDay={selectedMonthAggregationByDay.slice(0, 15)}
                                days={daysForSelectedMonth.slice(0, 15)}
                                selectedAction={selectedAction}
                                barGraphMax={barGraphMax}
                                setBarGraphMax={(max: AggregationBarGraphMax) => {
                                    setBarGraphMax(max);
                                    setAggregationBarGraphMax(max);
                                }}
                            />
                            <AggregationsBarGraph
                                aggregationByDay={selectedMonthAggregationByDay.slice(15)}
                                days={daysForSelectedMonth.slice(15)}
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
        return num;
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

export default MonthlyAggregations;
