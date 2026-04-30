import { Box, Stack, Typography, IconButton, CircularProgress } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { format, add, sub, differenceInCalendarDays } from 'date-fns';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import BasicAggregation from './components/BasicAggregation';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import useUserContext from '../../hooks/useUserContext';
import HorizontalSwipeBox from '../../components/HorizontalSwipeBox';

const DailyAggregations = () => {
    const { user, getUser } = useUserContext();
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation, isLoading: isLoadingAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, activeActions, getActions } = useActionContext();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const isToday = differenceInCalendarDays(new Date(), selectedDate) === 0;
    const isFirstDay = user !== undefined && user.first_track_at !== null && differenceInCalendarDays(selectedDate, user.first_track_at) === 0;

    const selectedDateAggregation = useMemo(() => {
        if (dailyAggregation === undefined) return undefined;
        const selectedMonthAgg = findMonthFromDailyAggregation(selectedDate);
        if (selectedMonthAgg === undefined) return undefined;
        const selectedDateAgg = selectedMonthAgg.find(date => date.date === selectedDate.getDate());
        if (selectedDateAgg === undefined) return undefined;
        return selectedDateAgg.aggregation;
    }, [dailyAggregation, findMonthFromDailyAggregation, selectedDate]);

    useEffect(() => {
        if (isLoadingAggregation) return;
        if (findMonthFromDailyAggregation(selectedDate) === undefined) getDailyAggregations([selectedDate]);
    }, [findMonthFromDailyAggregation, getDailyAggregations, isLoadingAggregation, selectedDate]);
    useEffect(() => {
        if (user === undefined) getUser();
    }, [getUser, user]);
    useEffect(() => {
        if (isLoadingActions) return;
        if (activeActions === undefined) getActions();
    }, [activeActions, getActions, isLoadingActions]);
    return (
        <BasePage pageName="Aggregation">
            <Box sx={{ pb: 12, pt: 4 }}>
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <IconButton
                        onClick={() => {
                            user?.first_track_at && !isFirstDay && setSelectedDate(new Date(user?.first_track_at));
                        }}
                        disabled={!user?.first_track_at || isFirstDay}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            !isFirstDay &&
                                setSelectedDate(prev => {
                                    return sub(prev, { days: 1 });
                                });
                        }}
                        disabled={isFirstDay}
                        sx={{ marginRight: 1 }}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Typography variant="body1" color="rgba(0, 0, 0, 0.87)">
                        {format(selectedDate, 'yyyy-MM-dd E')}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            !isToday &&
                                setSelectedDate(prev => {
                                    return add(prev, { days: 1 });
                                });
                        }}
                        disabled={isToday}
                        sx={{ marginLeft: 1 }}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            !isToday && setSelectedDate(new Date());
                        }}
                        disabled={isToday}
                        sx={{ marginLeft: 1 }}
                    >
                        <KeyboardDoubleArrowRightIcon />
                    </IconButton>
                </Stack>
                <HorizontalSwipeBox
                    allowRepetitiveSwipe
                    distance={50}
                    onSwipeLeft={swiped =>
                        swiped &&
                        !isToday &&
                        setSelectedDate(prev => {
                            return add(prev, { days: 1 });
                        })
                    }
                    onSwipeRight={swiped =>
                        swiped &&
                        !isFirstDay &&
                        setSelectedDate(prev => {
                            return sub(prev, { days: 1 });
                        })
                    }
                >
                    <Box sx={{ mt: 2 }}>
                        {isLoadingActions ? (
                            <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                        ) : (
                            <BasicAggregation aggregations={selectedDateAggregation} />
                        )}
                    </Box>
                </HorizontalSwipeBox>
            </Box>
        </BasePage>
    );
};

export default DailyAggregations;
