import { Box, Stack, Typography, IconButton, Select, MenuItem, type SelectChangeEvent, CircularProgress, Button, Tabs, Tab } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, startOfMonth, endOfMonth } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import BasicAggregation from './components/BasicAggregation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import type { Action } from '../../types/my_way';
import type { DurationsByAction } from '../../types/action_track';
import useLocalStorage, { type AggregationBarGraphMax } from '../../hooks/useLocalStorage';
import AggregationsBarGraph from './AggregationsBarGraph';

type TabType = 'graph' | 'table';

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
    const [selectedTab, setSelectedTab] = useState<TabType>('graph');
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

export default MonthlyAggregations;
