import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, CircularProgress, Grid, IconButton, type SelectChangeEvent, Stack, Typography } from "@mui/material";
import { add, differenceInCalendarDays, differenceInCalendarMonths, endOfMonth, format, startOfMonth, sub } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import BasePage from "../../components/BasePage";
import useActionContext from "../../hooks/useActionContext";
import useActionTrackContext from "../../hooks/useActionTrackContext";
import useCurrentUserContext from "../../hooks/useCurrentUserContext";
import useHorizontalSwipe from "../../hooks/useHorizontalSwipe";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getDurationString } from "../../hooks/useValueDisplay";
import type { DurationsByAction } from "../../types/action_track";
import type { Action } from "../../types/my_way";
import ActionRadios from "./components/ActionRadios";
import AggregationsBarGraph from "./components/AggregationsBarGraph";

const MonthlyAggregations = () => {
    const { user } = useCurrentUserContext();
    const {
        dailyAggregation,
        getDailyAggregations,
        isGetDailyAggregationsError,
        findMonthFromDailyAggregation,
        isLoading: isLoadingAggregation,
    } = useActionTrackContext();
    const { isLoading: isLoadingActions, activeActions, getActions, isGetActionsError } = useActionContext();
    const { aggregationActionId, setAggregationActionId: setLocalStorageActionId, setAggregationBarGraphMax, aggregationBarGraphMax } = useLocalStorage();
    const { HorizontalSwipeBox } = useHorizontalSwipe();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAction, setSelectedAction] = useState<Action>();
    const isThisMonth = differenceInCalendarMonths(new Date(), selectedDate) === 0;
    const isFirstMonth = user.first_track_at !== null && differenceInCalendarMonths(selectedDate, user.first_track_at) === 0;

    const selectAction = (event: SelectChangeEvent<string>) => {
        setSelectedAction(activeActions?.find((action) => action.id === event.target.value));
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
            const selectedDateAgg = selectedMonthAgg.find((date) => date.date === day.getDate());
            if (selectedDateAgg === undefined) {
                res.push([]);
                continue;
            }
            res.push(selectedDateAgg.aggregation);
        }
        return res;
    }, [dailyAggregation, daysForSelectedMonth, findMonthFromDailyAggregation]);

    const itemTotalArgs = useMemo(() => {
        if (selectedAction === undefined) return undefined;
        const aggregationTotal: AggTotal[] = [];
        for (const dateAgg of selectedMonthAggregationByDay) {
            for (const agg of dateAgg) {
                const target = aggregationTotal.find((item) => item.action_id === agg.action_id);
                if (target === undefined) {
                    aggregationTotal.push({ ...agg, days: 1 });
                } else {
                    target.duration += agg.duration;
                    target.count += agg.count;
                    target.days += 1;
                }
            }
        }
        const durationByAction = aggregationTotal.find((agg) => agg.action_id === selectedAction.id);

        return {
            durationByAction,
            selectedAction,
            totalDays: Math.min(daysForSelectedMonth.length, differenceInCalendarDays(new Date(), startOfMonth(selectedDate)) + 1),
        };
    }, [selectedAction, selectedMonthAggregationByDay, selectedDate, daysForSelectedMonth.length]);

    const aggregationsBarGraphArgs = useMemo(() => {
        if (selectedAction === undefined) return undefined;
        return {
            selectedAction,
            setBarGraphMax: setAggregationBarGraphMax,
            barGraphMax: aggregationBarGraphMax ?? {},
            first: {
                aggregationByDay: selectedMonthAggregationByDay.slice(0, 15),
                xLabels: daysForSelectedMonth.slice(0, 15).map((date) => date.getDate()),
            },
            latter: {
                aggregationByDay: selectedMonthAggregationByDay.slice(15),
                xLabels: daysForSelectedMonth.slice(15).map((date) => date.getDate()),
            },
        };
    }, [aggregationBarGraphMax, daysForSelectedMonth.slice, selectedAction, selectedMonthAggregationByDay.slice, setAggregationBarGraphMax]);

    useEffect(() => {
        if (activeActions === undefined) return;
        if (aggregationActionId === undefined) return;
        if (selectedAction !== undefined) return;
        const localStorageAction = activeActions.find((action) => action.id === aggregationActionId);
        setSelectedAction(localStorageAction ?? activeActions[0]);
    }, [activeActions, aggregationActionId, selectedAction]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <infinite loop>
    useEffect(() => {
        if (isGetDailyAggregationsError()) return;
        if (isLoadingAggregation) return;
        if (findMonthFromDailyAggregation(selectedDate) === undefined) getDailyAggregations([selectedDate]);
    }, [selectedDate, findMonthFromDailyAggregation, isLoadingAggregation, isGetDailyAggregationsError]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <infinite loop>
    useEffect(() => {
        if (isGetActionsError()) return;
        if (isLoadingActions) return;
        if (activeActions === undefined) getActions();
    }, [activeActions, isLoadingActions, isGetActionsError]);
    return (
        <BasePage pageName="Aggregation">
            <Box sx={{ pt: 4 }}>
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <IconButton
                        onClick={() => {
                            user.first_track_at && !isFirstMonth && setSelectedDate(new Date(user.first_track_at));
                        }}
                        disabled={!user.first_track_at || isFirstMonth}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            !isFirstMonth &&
                                setSelectedDate((prev) => {
                                    return sub(prev, { months: 1 });
                                });
                        }}
                        disabled={isFirstMonth}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Typography variant="body1" color="rgba(0, 0, 0, 0.87)">
                        {format(startOfMonth(selectedDate), "yyyy/MM")}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            !isThisMonth &&
                                setSelectedDate((prev) => {
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
                            !isThisMonth && setSelectedDate(new Date());
                        }}
                        disabled={isThisMonth}
                        sx={{ marginLeft: 1 }}
                    >
                        <KeyboardDoubleArrowRightIcon />
                    </IconButton>
                </Stack>
                <HorizontalSwipeBox
                    allowRepetitiveSwipe
                    distance={50}
                    onSwipeLeft={(swiped) =>
                        swiped &&
                        !isThisMonth &&
                        setSelectedDate((prev) => {
                            return add(prev, { months: 1 });
                        })
                    }
                    onSwipeRight={(swiped) =>
                        swiped &&
                        !isFirstMonth &&
                        setSelectedDate((prev) => {
                            return sub(prev, { months: 1 });
                        })
                    }
                >
                    <Box sx={{ mt: 1 }}>
                        {selectedAction === undefined ? (
                            <CircularProgress style={{ marginRight: "auto", marginLeft: "auto" }} />
                        ) : (
                            <>
                                <ActionRadios selectedAction={selectedAction} actions={activeActions} selectAction={selectAction} />
                                {itemTotalArgs !== undefined && (
                                    <ItemTotal
                                        durationByAction={itemTotalArgs.durationByAction}
                                        selectedAction={itemTotalArgs.selectedAction}
                                        totalDays={itemTotalArgs.totalDays}
                                    />
                                )}
                                {aggregationsBarGraphArgs !== undefined && (
                                    <>
                                        <AggregationsBarGraph
                                            aggregationByDay={aggregationsBarGraphArgs.first.aggregationByDay}
                                            xLabels={aggregationsBarGraphArgs.first.xLabels}
                                            selectedAction={aggregationsBarGraphArgs.selectedAction}
                                            barGraphMax={aggregationsBarGraphArgs.barGraphMax}
                                            setBarGraphMax={aggregationsBarGraphArgs.setBarGraphMax}
                                        />
                                        <Box mt="-20px">
                                            <AggregationsBarGraph
                                                aggregationByDay={aggregationsBarGraphArgs.latter.aggregationByDay}
                                                xLabels={aggregationsBarGraphArgs.latter.xLabels}
                                                selectedAction={aggregationsBarGraphArgs.selectedAction}
                                                barGraphMax={aggregationsBarGraphArgs.barGraphMax}
                                                setBarGraphMax={aggregationsBarGraphArgs.setBarGraphMax}
                                            />
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </Box>
                </HorizontalSwipeBox>
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
interface ItemTotalProps {
    durationByAction?: AggTotal;
    selectedAction: Action;
    totalDays: number;
}
const ItemTotal = ({ durationByAction, selectedAction, totalDays }: ItemTotalProps) => {
    const value = selectedAction.track_type === "TimeSpan" ? durationByAction?.duration : durationByAction?.count;
    const getDisplayValue = (num?: number) => {
        if (selectedAction.track_type === "TimeSpan") return getDurationString(num) ?? "-";
        if (num === undefined || num === 0) return "-";
        return Math.floor(num * 100) / 100;
    };

    const total = getDisplayValue(value);
    const daysWithTrack = value && durationByAction?.days;
    const averageByCalendar = value && getDisplayValue(value / totalDays);
    const averageByDaysWithTrack = value && getDisplayValue(value / (durationByAction?.days ?? 1));

    return (
        <Grid container mt={2} mx={2} spacing={1} sx={{ textAlign: "left" }}>
            <Grid size={6}>
                <Typography variant="body2">合計:{total}</Typography>
            </Grid>
            <Grid size={6}>
                <Typography variant="body2">実施日数:{daysWithTrack}</Typography>
            </Grid>
            <Grid size={6}>
                <Typography variant="body2">1日平均:{averageByCalendar}</Typography>
            </Grid>
            <Grid size={6}>
                <Typography variant="body2">実施日平均:{averageByDaysWithTrack}</Typography>
            </Grid>
        </Grid>
    );
};

export default MonthlyAggregations;
