import { Box, Stack, Typography, IconButton, Button } from '@mui/material';
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

const DailyAggregations = () => {
    const { user, getUser } = useUserContext();
    const { dailyAggregation, getDailyAggregations, findMonthFromDailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();

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
        if (findMonthFromDailyAggregation(selectedDate) === undefined) getDailyAggregations([selectedDate]);
        // actions is for re-triggering after cacheClear. Assigning dailyAggregation results in infinite loop.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate, actions]);
    useEffect(() => {
        if (user === undefined) getUser();
    }, [getUser, user]);
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
                            if (!user?.first_track_at) return;
                            setSelectedDate(new Date(user?.first_track_at));
                        }}
                        disabled={!user?.first_track_at || isFirstDay}
                    >
                        <KeyboardDoubleArrowLeftIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return sub(prev, { days: 1 });
                            });
                        }}
                        disabled={isFirstDay}
                    >
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <Typography variant='body1' color='rgba(0, 0, 0, 0.87)'>
                        {format(selectedDate, 'yyyy-MM-dd E')}
                    </Typography>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(prev => {
                                return add(prev, { days: 1 });
                            });
                        }}
                        disabled={isToday}
                    >
                        <KeyboardArrowRightIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            setSelectedDate(new Date());
                        }}
                        disabled={isToday}
                    >
                        <KeyboardDoubleArrowRightIcon />
                    </IconButton>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <BasicAggregation aggregations={selectedDateAggregation} />
                </Box>
            </Box>
        </BasePage>
    );
};

export default DailyAggregations;
