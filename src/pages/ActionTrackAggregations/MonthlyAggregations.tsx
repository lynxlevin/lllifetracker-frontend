import { Box, Stack, Typography, IconButton, Select, MenuItem, type SelectChangeEvent, CircularProgress, styled, Button, Tabs, Tab } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, startOfMonth, endOfMonth } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import BasicAggregation from './components/BasicAggregation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { orange } from '@mui/material/colors';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';
import { type BarLabelProps, BarPlot, ChartContainer, ChartsXAxis, ChartsYAxis, useAnimate } from '@mui/x-charts';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import useLocalStorage from '../../hooks/useLocalStorage';

type TabType = 'graph' | 'table';

const MonthlyAggregations = () => {
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTab, setSelectedTab] = useState<TabType>('graph');

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
                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue: TabType) => {
                        setSelectedTab(newValue);
                    }}
                    centered
                >
                    <Tab label='グラフ' value={'graph' as TabType} />
                    <Tab label='統計' value={'table' as TabType} />
                </Tabs>
                {selectedTab === 'graph' && (
                    <MonthlyAggregationsGraph selectedMonthAggregationByDay={selectedMonthAggregationByDay} daysForSelectedMonth={daysForSelectedMonth} />
                )}
                {selectedTab === 'table' && (
                    <Box sx={{ mt: 2 }}>
                        <BasicAggregation aggregations={selectedMonthAggregationTotal} selectedDatesCount={7} />
                    </Box>
                )}
            </Box>
        </BasePage>
    );
};

const MonthlyAggregationsGraph = ({
    selectedMonthAggregationByDay,
    daysForSelectedMonth,
}: { selectedMonthAggregationByDay: DurationsByAction[][]; daysForSelectedMonth: Date[] }) => {
    const { actions } = useActionContext();
    const { getMonthlyAggSelectedActionId: getLocalStorageActionId, setMonthlyAggSelectedActionId: setLocalStorageActionId } = useLocalStorage();

    const [selectedAction, setSelectedAction] = useState<Action>();

    const selectAction = (event: SelectChangeEvent<string>) => {
        setSelectedAction(actions?.find(action => action.id === event.target.value));
        setLocalStorageActionId(event.target.value);
    };

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
    return (
        <Box sx={{ mt: 2 }}>
            {selectedAction === undefined ? (
                <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
            ) : (
                <>
                    <Select value={selectedAction?.id} onChange={selectAction}>
                        {actions?.map(action => (
                            <MenuItem key={action.id} value={action.id}>
                                {action.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <ChartContainer
                        height={200}
                        width={1000}
                        style={{ translate: '-60px 0' }}
                        series={[
                            {
                                data: selectedMonthAggregationByDay.map(dateAgg =>
                                    selectedAction.track_type === 'TimeSpan'
                                        ? (dateAgg.find(agg => agg.action_id === selectedAction.id)?.duration ?? 0) / 60
                                        : (dateAgg.find(agg => agg.action_id === selectedAction.id)?.count ?? 0),
                                ),
                                label: selectedAction.track_type === 'TimeSpan' ? '時間(分)' : '回数',
                                type: 'bar',
                            },
                        ]}
                        colors={[selectedAction.color ?? orange[500]]}
                        xAxis={[{ scaleType: 'band', data: daysForSelectedMonth.map(date => `${date.getMonth() + 1}/${date.getDate()}`) }]}
                    >
                        <BarPlot
                            barLabel={(item, _) => {
                                return selectedAction.track_type === 'TimeSpan' ? getDuration(item.value) : item.value === 0 ? '' : item.value?.toString();
                            }}
                            slots={{ barLabel: BarLabel }}
                        />
                        <ChartsXAxis disableTicks />
                        <ChartsYAxis tickLabelStyle={{ display: 'none' }} disableLine disableTicks />
                    </ChartContainer>
                </>
            )}
        </Box>
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

export default MonthlyAggregations;
