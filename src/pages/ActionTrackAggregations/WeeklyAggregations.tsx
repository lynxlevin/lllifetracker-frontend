import { Box, Stack, Typography, IconButton, Select, MenuItem, type SelectChangeEvent, CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, startOfWeek, endOfWeek } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import BasicAggregation from './components/BasicAggregation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { orange } from '@mui/material/colors';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';

const WeeklyAggregations = () => {
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAction, setSelectedAction] = useState<Action>();

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
    useEffect(() => {
        if (actions === undefined) return;
        if (selectedAction === undefined) setSelectedAction(actions[0]);
    }, [actions, selectedAction]);
    return (
        <BasePage pageName='Aggregation'>
            <Box sx={{ pb: 12, pt: 4 }}>
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
                    <Typography variant='body1'>
                        {format(startOfWeek(selectedDate), 'yyyy-MM-dd E')} - {format(endOfWeek(selectedDate), 'yyyy-MM-dd E')}
                    </Typography>
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
                <Box sx={{ mt: 2 }}>
                    {selectedAction === undefined ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        <>
                            <Select
                                value={selectedAction?.id}
                                onChange={(event: SelectChangeEvent<string>) => setSelectedAction(actions?.find(action => action.id === event.target.value))}
                            >
                                {actions?.map(action => (
                                    <MenuItem key={action.id} value={action.id}>
                                        {action.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            {/* FIXME: Find a way to display number on touch */}
                            <BarChart
                                height={200}
                                series={[
                                    {
                                        data: selectedWeekAggregationByDay.map(dateAgg =>
                                            selectedAction.track_type === 'TimeSpan'
                                                ? (dateAgg.find(agg => agg.action_id === selectedAction.id)?.duration ?? 0) / 60
                                                : (dateAgg.find(agg => agg.action_id === selectedAction.id)?.count ?? 0),
                                        ),
                                        label: selectedAction.track_type === 'TimeSpan' ? '時間(分)' : '回数',
                                    },
                                ]}
                                colors={[selectedAction.color ?? orange[500]]}
                                xAxis={[{ data: daysForSelectedWeek.map(date => `${date.getMonth() + 1}/${date.getDate()}`) }]}
                            />
                        </>
                    )}
                </Box>
                <Box sx={{ mt: 2 }}>
                    <BasicAggregation aggregations={selectedWeekAggregationTotal} selectedDatesCount={7} />
                </Box>
            </Box>
        </BasePage>
    );
};

export default WeeklyAggregations;
