import { Box, Stack, Typography, IconButton, Select, MenuItem, type SelectChangeEvent, CircularProgress, Button, Tabs, Tab } from '@mui/material';
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
import useLocalStorage from '../../hooks/useLocalStorage';
import AggregationsBarGraph from './AggregationsBarGraph';

type TabType = 'graph' | 'table';

const WeeklyAggregations = () => {
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();
    const { getWeeklyAggSelectedActionId: getLocalStorageActionId, setWeeklyAggSelectedActionId: setLocalStorageActionId } = useLocalStorage();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTab, setSelectedTab] = useState<TabType>('graph');
    const [selectedAction, setSelectedAction] = useState<Action>();

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
                                    aggregationByDay={selectedWeekAggregationByDay.slice(0, 15)}
                                    days={daysForSelectedWeek.slice(0, 15)}
                                    selectedAction={selectedAction}
                                />
                            </>
                        )}
                    </Box>
                )}
                {selectedTab === 'table' && (
                    <Box sx={{ mt: 2 }}>
                        <BasicAggregation aggregations={selectedWeekAggregationTotal} selectedDatesCount={7} />
                    </Box>
                )}
            </Box>
        </BasePage>
    );
};

export default WeeklyAggregations;
