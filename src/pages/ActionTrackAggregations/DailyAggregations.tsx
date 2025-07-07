import { Box, Stack, Typography, IconButton, Button, styled, Tabs, Tab, CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import BasicAggregation from './components/BasicAggregation';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { orange } from '@mui/material/colors';
import type { Action, ActionTrackType } from '../../types/my_way';
import { BarChart, type BarLabelProps, useAnimate } from '@mui/x-charts';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
import { getDurationString } from '../../hooks/useValueDisplay';

type TabType = 'graph' | 'table';

const DailyAggregations = () => {
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTab, setSelectedTab] = useState<TabType>('graph');

    const selectedDateAggregation = useMemo(() => {
        if (dailyAggregation === undefined) return undefined;
        const selectedMonthAgg = findMonthFromDailyAggregation(selectedDate);
        if (selectedMonthAgg === undefined) return undefined;
        const selectedDateAgg = selectedMonthAgg.find(date => date.date === selectedDate.getDate());
        if (selectedDateAgg === undefined) return undefined;
        return selectedDateAgg.aggregation;
    }, [dailyAggregation, findMonthFromDailyAggregation, selectedDate]);

    const selectedDateAggregationWithName = useMemo(() => {
        if (selectedDateAggregation === undefined) return undefined;
        if (actions === undefined) return undefined;
        return actions.map(action => {
            const agg = selectedDateAggregation.find(agg => agg.action_id === action.id);
            return {
                actionId: action.id,
                name: action.name,
                duration: agg?.duration ?? 0,
                count: agg?.count ?? 0,
                trackType: action.track_type,
                color: action.color ?? orange[500],
            };
        });
    }, [actions, selectedDateAggregation]);

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
            <Box sx={{ pb: 12, pt: 4 }}>
                <Stack direction='row' justifyContent='center' alignItems='center'>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return sub(prev, { days: 7 });
                            });
                        }}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return sub(prev, { days: 1 });
                            });
                        }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Button onClick={() => setSelectedDate(new Date())}>
                        <Typography variant='body1' color='rgba(0, 0, 0, 0.87)'>
                            {format(selectedDate, 'yyyy-MM-dd E')}
                        </Typography>
                    </Button>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return add(prev, { days: 1 });
                            });
                        }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return add(prev, { days: 7 });
                            });
                        }}
                    >
                        <KeyboardDoubleArrowRightIcon />
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
                    <Box sx={{ mt: 2 }}>
                        {actions === undefined ? (
                            <CircularProgress />
                        ) : (
                            <>
                                <BarGraph
                                    aggregations={
                                        selectedDateAggregationWithName?.filter(agg => {
                                            return agg.trackType === 'TimeSpan';
                                        }) ?? []
                                    }
                                    actions={actions.filter(action => action.track_type === 'TimeSpan')}
                                    trackType='TimeSpan'
                                />
                                <BarGraph
                                    aggregations={
                                        selectedDateAggregationWithName?.filter(agg => {
                                            return agg.trackType === 'Count';
                                        }) ?? []
                                    }
                                    actions={actions.filter(action => action.track_type === 'Count')}
                                    trackType='Count'
                                />
                            </>
                        )}
                    </Box>
                )}
                {selectedTab === 'table' && (
                    <Box sx={{ mt: 2 }}>
                        <BasicAggregation aggregations={selectedDateAggregation} />
                    </Box>
                )}
            </Box>
        </BasePage>
    );
};

const BarGraph = ({
    aggregations,
    actions,
    trackType,
}: {
    aggregations: { actionId: string; name: string; duration: number; count: number; trackType: ActionTrackType; color: string }[];
    actions: Action[];
    trackType: ActionTrackType;
}) => {
    const valueFormatter = (v: number | null) => {
        return trackType === 'TimeSpan' ? (getDurationString(v, true) ?? '') : `${v ?? '-'}`;
    };
    return (
        <>
            <BarChart
                height={150}
                width={400}
                style={{ translate: '-25px 0' }}
                dataset={
                    trackType === 'TimeSpan'
                        ? aggregations.map(agg => {
                              const res = {};
                              Object.defineProperty(res, agg.name, { value: agg.duration });
                              for (const action of actions) {
                                  if (agg.actionId === action.id) continue;
                                  Object.defineProperty(res, action.name, { value: 0 });
                              }
                              return res;
                          })
                        : aggregations.map(agg => {
                              const res = {};
                              Object.defineProperty(res, agg.name, { value: agg.count });
                              for (const action of actions) {
                                  if (agg.actionId === action.id) continue;
                                  Object.defineProperty(res, action.name, { value: 0 });
                              }
                              return res;
                          })
                }
                series={actions.map((action, i) => {
                    return trackType === 'TimeSpan'
                        ? { label: `${i + 1}: ${action.name}`, dataKey: action.name, valueFormatter, stack: 'TimeSpan' }
                        : { label: `${i + 1}: ${action.name}`, dataKey: action.name, valueFormatter, stack: 'Count' };
                })}
                colors={actions.map(action => action.color ?? orange[500])}
                xAxis={[
                    {
                        scaleType: 'band',
                        data: actions.map((_, i) => i + 1),
                        disableTicks: true,
                        categoryGapRatio: 0.4,
                    },
                ]}
                yAxis={[{ disableTicks: true, tickLabelStyle: { display: 'none' }, disableLine: true }]}
            />
        </>
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

    return <Text {...otherProps} fill={color} textAnchor='middle' {...animatedProps} style={{ fontSize: '9px' }} />;
}

export default DailyAggregations;
