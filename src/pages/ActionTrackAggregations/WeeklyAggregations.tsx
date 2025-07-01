import { Box, Stack, Typography, IconButton, Select, MenuItem, type SelectChangeEvent, CircularProgress, Divider } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, startOfWeek, endOfWeek } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import BasicAggregation from './components/BasicAggregation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';

const WeeklyAggregations = () => {
    const { isLoading: isLoadingAggregation, dailyAggregation, getDailyAggregations } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAction, setSelectedAction] = useState<Action>();

    const selectedWeekAggregation = useMemo(() => {
        if (dailyAggregation === undefined) return undefined;
        const start = startOfWeek(selectedDate);
        const days = [
            start,
            add(start, { days: 1 }),
            add(start, { days: 2 }),
            add(start, { days: 3 }),
            add(start, { days: 4 }),
            add(start, { days: 5 }),
            add(start, { days: 6 }),
        ];

        const res: DurationsByAction[] = [];
        for (const day of days) {
            const selectedMonthAgg = dailyAggregation[`${day.getFullYear() * 100 + day.getMonth() + 1}`];
            if (selectedMonthAgg === undefined) continue;
            const selectedDateAgg = selectedMonthAgg.find(date => date.date === day.getDate());
            if (selectedDateAgg === undefined) continue;
            const aggregation = selectedDateAgg.aggregation;
            for (const agg of aggregation) {
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
    }, [dailyAggregation, selectedDate]);

    useEffect(() => {
        if (dailyAggregation === undefined && !isLoadingAggregation) {
            const start = startOfWeek(selectedDate);
            const end = endOfWeek(selectedDate);
            const target = [start];
            if (end.getMonth() !== start.getMonth()) target.push(end);
            getDailyAggregations(target.map(date => date.getFullYear() * 100 + date.getMonth() + 1));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dailyAggregation, getDailyAggregations]);
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
                {/* <Box sx={{ mt: 2 }}>
                    {
                        selectedAction === undefined ? (
                            <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                        ) : (
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
                        )
                        // <BarChart  />
                    }
                </Box> */}
                <Divider sx={{ mt: 2 }} />
                <Box sx={{ mt: 2 }}>
                    <BasicAggregation aggregations={selectedWeekAggregation} />
                </Box>
            </Box>
        </BasePage>
    );
};

export default WeeklyAggregations;
