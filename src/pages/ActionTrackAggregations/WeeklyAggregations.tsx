import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { Box, CircularProgress, Grid, IconButton, type SelectChangeEvent, Stack, Typography } from "@mui/material";
import { add, differenceInCalendarDays, differenceInCalendarWeeks, endOfWeek, format, startOfWeek, sub } from "date-fns";
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

const WeeklyAggregations = () => {
    const { user } = useCurrentUserContext();
    const {
        dailyAggregation,
        getDailyAggregations,
        isGetDailyAggregationsError,
        findMonthFromDailyAggregation,
        isLoading: isLoadingAggregation,
    } = useActionTrackContext();
    const { isLoading: isLoadingActions, activeActions, getActions, isGetActionsError } = useActionContext();
    const { aggregationActionId, setAggregationActionId: setLocalStorageActionId, aggregationBarGraphMax, setAggregationBarGraphMax } = useLocalStorage();
    const { HorizontalSwipeBox } = useHorizontalSwipe();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedAction, setSelectedAction] = useState<Action>();
    const isThisWeek = differenceInCalendarWeeks(new Date(), selectedDate) === 0;
    const isFirstWeek = user.first_track_at !== null && differenceInCalendarWeeks(selectedDate, user.first_track_at) === 0;

    const selectAction = (event: SelectChangeEvent<string>) => {
        setSelectedAction(activeActions?.find((action) => action.id === event.target.value));
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
            const selectedDateAgg = selectedMonthAgg.find((date) => date.date === day.getDate());
            if (selectedDateAgg === undefined) {
                res.push([]);
                continue;
            }
            res.push(selectedDateAgg.aggregation);
        }
        return res;
    }, [dailyAggregation, daysForSelectedWeek, findMonthFromDailyAggregation]);

    const itemTotalArgs = useMemo(() => {
        if (selectedAction === undefined) return undefined;
        const aggregationTotal: AggTotal[] = [];
        for (const dateAgg of selectedWeekAggregationByDay) {
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
            totalDays: Math.min(daysForSelectedWeek.length, differenceInCalendarDays(new Date(), startOfWeek(selectedDate)) + 1),
        };
    }, [daysForSelectedWeek.length, selectedAction, selectedDate, selectedWeekAggregationByDay]);

    const aggregationsBarGraphArgs = useMemo(() => {
        if (selectedAction === undefined) return undefined;
        return {
            aggregationByDay: selectedWeekAggregationByDay,
            xLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            selectedAction: selectedAction,
            barGraphMax: aggregationBarGraphMax ?? {},
            setBarGraphMax: setAggregationBarGraphMax,
        };
    }, [aggregationBarGraphMax, selectedAction, selectedWeekAggregationByDay, setAggregationBarGraphMax]);

    useEffect(() => {
        if (activeActions === undefined) return;
        if (aggregationActionId === undefined) return;
        if (selectedAction !== undefined) return;
        const localStorageAction = activeActions.find((action) => action.id === aggregationActionId);
        setSelectedAction(localStorageAction ?? activeActions[0]);
    }, [activeActions, aggregationActionId, selectedAction]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <>
    useEffect(() => {
        if (isGetDailyAggregationsError()) return;
        if (isLoadingAggregation) return;
        const start = startOfWeek(selectedDate);
        const end = endOfWeek(selectedDate);
        const target = [];
        if (findMonthFromDailyAggregation(start) === undefined) target.push(start);
        if (end.getMonth() !== start.getMonth() && findMonthFromDailyAggregation(end) === undefined) target.push(end);
        if (target.length === 0) return;
        getDailyAggregations(target);
    }, [findMonthFromDailyAggregation, isLoadingAggregation, selectedDate, isGetDailyAggregationsError]);
    // biome-ignore lint/correctness/useExhaustiveDependencies: <>
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
                            user.first_track_at && !isFirstWeek && setSelectedDate(new Date(user.first_track_at));
                        }}
                        disabled={!user.first_track_at || isFirstWeek}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            !isFirstWeek &&
                                setSelectedDate((prev) => {
                                    return sub(prev, { weeks: 1 });
                                });
                        }}
                        disabled={isFirstWeek}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Typography variant="body1" color="rgba(0, 0, 0, 0.87)">
                        {format(startOfWeek(selectedDate), "yyyy/MM/dd")} -{" "}
                        {format(
                            endOfWeek(selectedDate),
                            endOfWeek(selectedDate).getFullYear() !== startOfWeek(selectedDate).getFullYear() ? "yyyy/MM/dd" : "MM/dd",
                        )}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            !isThisWeek &&
                                setSelectedDate((prev) => {
                                    return add(prev, { weeks: 1 });
                                });
                        }}
                        disabled={isThisWeek}
                        sx={{ marginLeft: 1 }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            !isThisWeek && setSelectedDate(new Date());
                        }}
                        disabled={isThisWeek}
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
                        !isThisWeek &&
                        setSelectedDate((prev) => {
                            return add(prev, { weeks: 1 });
                        })
                    }
                    onSwipeRight={(swiped) =>
                        swiped &&
                        !isFirstWeek &&
                        setSelectedDate((prev) => {
                            return sub(prev, { weeks: 1 });
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
                                    <AggregationsBarGraph
                                        aggregationByDay={aggregationsBarGraphArgs.aggregationByDay}
                                        xLabels={aggregationsBarGraphArgs.xLabels}
                                        selectedAction={aggregationsBarGraphArgs.selectedAction}
                                        barGraphMax={aggregationsBarGraphArgs.barGraphMax}
                                        setBarGraphMax={aggregationsBarGraphArgs.setBarGraphMax}
                                    />
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

export default WeeklyAggregations;
