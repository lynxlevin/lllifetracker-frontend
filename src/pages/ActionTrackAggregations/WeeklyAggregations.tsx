import { Box, Stack, Typography, IconButton, Select, MenuItem, type SelectChangeEvent, CircularProgress, styled, Button } from '@mui/material';
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
import { type BarLabelProps, BarPlot, ChartContainer, ChartsXAxis, ChartsYAxis, useAnimate } from '@mui/x-charts';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';

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

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getDuration = (minutesTotal: number | null) => {
        if (minutesTotal === null || minutesTotal === 0) return '';
        const hours = Math.floor(minutesTotal / 60);
        const minutes = Math.floor(minutesTotal % 60);
        return `${hours}:${zeroPad(minutes)}`;
    };

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
                            <ChartContainer
                                height={200}
                                width={400}
                                style={{ translate: '-60px 0' }}
                                series={[
                                    {
                                        data: selectedWeekAggregationByDay.map(dateAgg =>
                                            selectedAction.track_type === 'TimeSpan'
                                                ? (dateAgg.find(agg => agg.action_id === selectedAction.id)?.duration ?? 0) / 60
                                                : (dateAgg.find(agg => agg.action_id === selectedAction.id)?.count ?? 0),
                                        ),
                                        label: selectedAction.track_type === 'TimeSpan' ? '時間(分)' : '回数',
                                        type: 'bar',
                                    },
                                ]}
                                colors={[selectedAction.color ?? orange[500]]}
                                xAxis={[{ scaleType: 'band', data: daysForSelectedWeek.map(date => `${date.getMonth() + 1}/${date.getDate()}`) }]}
                            >
                                <BarPlot
                                    barLabel={(item, _) => {
                                        return selectedAction.track_type === 'TimeSpan'
                                            ? getDuration(item.value)
                                            : item.value === 0
                                              ? ''
                                              : item.value?.toString();
                                    }}
                                    slots={{ barLabel: BarLabel }}
                                />
                                <ChartsXAxis disableTicks />
                                <ChartsYAxis tickLabelStyle={{ display: 'none' }} disableLine disableTicks />
                            </ChartContainer>
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

const Text = styled('text')(({ theme }) => ({
    ...theme?.typography?.body2,
    stroke: 'none',
    fill: (theme.vars || theme)?.palette?.text?.primary,
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    pointerEvents: 'none',
}));

function BarLabel(props: BarLabelProps) {
    const { seriesId, dataIndex, color, isFaded, isHighlighted, classes, xOrigin, yOrigin, x, y, width, height, layout, skipAnimation, ...otherProps } = props;

    const animatedProps = useAnimate(
        { x: x + width / 2, y: y - 8 },
        {
            initialProps: { x: x + width / 2, y: yOrigin },
            createInterpolator: interpolateObject,
            transformProps: p => p,
            applyProps: (element: SVGTextElement, p) => {
                element.setAttribute('x', p.x.toString());
                element.setAttribute('y', p.y.toString());
            },
            skip: skipAnimation,
        },
    );

    return <Text {...otherProps} fill={color} textAnchor='middle' {...animatedProps} />;
}

export default WeeklyAggregations;
