import { Box, Stack, Typography, IconButton } from '@mui/material';
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

const DailyAggregations = () => {
    const { isLoading: isLoadingAggregation, dailyAggregation, getDailyAggregations } = useActionTrackContext();
    const { isLoading: isLoadingActions, actions, getActions } = useActionContext();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const selectedDateAggregation = useMemo(() => {
        if (dailyAggregation === undefined) return undefined;
        const selectedMonthAgg = dailyAggregation[`${selectedDate.getFullYear() * 100 + selectedDate.getMonth() + 1}`];
        if (selectedMonthAgg === undefined) return undefined;
        const selectedDateAgg = selectedMonthAgg.find(date => date.date === selectedDate.getDate());
        if (selectedDateAgg === undefined) return undefined;
        return selectedDateAgg.aggregation;
    }, [dailyAggregation, selectedDate]);

    useEffect(() => {
        if (dailyAggregation === undefined && !isLoadingAggregation) getDailyAggregations([selectedDate.getFullYear() * 100 + selectedDate.getMonth() + 1]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dailyAggregation, getDailyAggregations]);
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
                    <Typography variant='h6'>{format(selectedDate, 'yyyy-MM-dd E')}</Typography>
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
                <Box sx={{ mt: 2 }}>
                    <BasicAggregation aggregations={selectedDateAggregation} />
                </Box>
            </Box>
        </BasePage>
    );
};

export default DailyAggregations;
