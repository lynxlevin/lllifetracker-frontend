import { Box, Stack, Typography, IconButton, type SelectChangeEvent, CircularProgress, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, startOfMonth, endOfMonth, differenceInCalendarDays, differenceInCalendarMonths } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';
import useLocalStorage from '../../hooks/useLocalStorage';
import AggregationsBarGraph from './components/AggregationsBarGraph';
import { getDurationString } from '../../hooks/useValueDisplay';
import ActionRadios from './components/ActionRadios';
import useUserContext from '../../hooks/useUserContext';

const MonthlyAggregations = () => {
    const { user, getUser } = useUserContext();
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();
    const { aggregationActionId, setAggregationActionId: setLocalStorageActionId, setAggregationBarGraphMax, aggregationBarGraphMax } = useLocalStorage();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAction, setSelectedAction] = useState<Action>();
    const isThisMonth = differenceInCalendarMonths(new Date(), selectedDate) === 0;
    const isFirstMonth = user !== undefined && user.first_track_at !== null && differenceInCalendarMonths(selectedDate, user.first_track_at) === 0;

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

        const res: AggTotal[] = [];
        for (const dateAgg of selectedMonthAggregationByDay) {
            for (const agg of dateAgg) {
                const target = res.find(item => item.action_id === agg.action_id);
                if (target === undefined) {
                    res.push({ ...agg, days: 1 });
                } else {
                    target.duration += agg.duration;
                    target.count += agg.count;
                    target.days += 1;
                }
            }
        }
        return res.length === 0 ? undefined : res;
    }, [dailyAggregation, selectedMonthAggregationByDay]);

    useEffect(() => {
        if (actions === undefined) return;
        if (aggregationActionId === undefined) return;
        if (selectedAction !== undefined) return;
        const localStorageAction = actions.find(action => action.id === aggregationActionId);
        setSelectedAction(localStorageAction ?? actions[0]);
    }, [actions, aggregationActionId, selectedAction]);
    useEffect(() => {
        if (findMonthFromDailyAggregation(selectedDate) === undefined) getDailyAggregations([selectedDate]);
        // actions is for re-triggering after cacheClear. Assigning dailyAggregation results in infinite loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, actions]);
    useEffect(() => {
        if (user === undefined) getUser();
    }, [getUser, user]);
    useEffect(() => {
        if (actions === undefined && !isLoadingActions) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage pageName="Aggregation">
            <Box sx={{ pt: 4 }}>
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <IconButton
                        onClick={() => {
                            if (!user?.first_track_at) return;
                            setSelectedDate(new Date(user?.first_track_at));
                        }}
                        disabled={!user?.first_track_at || isFirstMonth}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return sub(prev, { months: 1 });
                            });
                        }}
                        disabled={isFirstMonth}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Typography variant="body1" color="rgba(0, 0, 0, 0.87)">
                        {format(startOfMonth(selectedDate), 'yyyy/MM')}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return add(prev, { months: 1 });
                            });
                        }}
                        disabled={isThisMonth}
                        sx={{ marginLeft: 1 }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(new Date());
                        }}
                        disabled={isThisMonth}
                        sx={{ marginLeft: 1 }}
                    >
                        <KeyboardDoubleArrowRightIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ mt: 1 }}>
                    {selectedAction === undefined ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        <>
                            <ActionRadios selectedAction={selectedAction} actions={actions} selectAction={selectAction} />
                            <ItemTotal
                                durationByAction={selectedMonthAggregationTotal?.find(agg => agg.action_id === selectedAction.id)}
                                selectedAction={selectedAction}
                                totalDays={Math.min(
                                    differenceInCalendarDays(endOfMonth(selectedDate), startOfMonth(selectedDate)) + 1,
                                    differenceInCalendarDays(new Date(), startOfMonth(selectedDate)) + 1,
                                )}
                            />
                            <AggregationsBarGraph
                                aggregationByDay={selectedMonthAggregationByDay.slice(0, 15)}
                                xLabels={daysForSelectedMonth.slice(0, 15).map(date => date.getDate())}
                                selectedAction={selectedAction}
                                barGraphMax={aggregationBarGraphMax ?? {}}
                                setBarGraphMax={setAggregationBarGraphMax}
                            />
                            <Box mt="-20px">
                                <AggregationsBarGraph
                                    aggregationByDay={selectedMonthAggregationByDay.slice(15)}
                                    xLabels={daysForSelectedMonth.slice(15).map(date => date.getDate())}
                                    selectedAction={selectedAction}
                                    barGraphMax={aggregationBarGraphMax ?? {}}
                                    setBarGraphMax={setAggregationBarGraphMax}
                                />
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </BasePage>
    );
};

interface AggTotal {
    action_id: string;
    duration: number;
    count: number;
    days: number;
}
const ItemTotal = ({ durationByAction, selectedAction, totalDays }: { durationByAction?: AggTotal; selectedAction: Action; totalDays: number }) => {
    const value = selectedAction.track_type === 'TimeSpan' ? durationByAction?.duration : durationByAction?.count;
    const getDisplayValue = (num?: number) => {
        if (selectedAction.track_type === 'TimeSpan') return getDurationString(num) ?? '-';
        if (num === undefined || num === 0) return '-';
        return Math.floor(num * 100) / 100;
    };

    return (
        <Grid container mt={2} mx={2} spacing={1} sx={{ textAlign: 'left' }}>
            <Grid size={6}>
                <Typography variant="body2">合計:{getDisplayValue(value)}</Typography>
            </Grid>
            <Grid size={6}>
                <Typography variant="body2">実施日数:{value && durationByAction?.days}</Typography>
            </Grid>
            {selectedAction.track_type === 'TimeSpan' ? (
                <Grid size={6}>
                    <Typography variant="body2">1回平均:{value && getDisplayValue(value / durationByAction!.count)}</Typography>
                </Grid>
            ) : (
                <Grid size={6}>
                    <Typography variant="body2">1日平均:{value && getDisplayValue(value / totalDays)}</Typography>
                </Grid>
            )}
            <Grid size={6}>
                <Typography variant="body2">実施日平均:{value && getDisplayValue(value / (durationByAction?.days ?? 1))}</Typography>
            </Grid>
        </Grid>
    );
};

export default MonthlyAggregations;
