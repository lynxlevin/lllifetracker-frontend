import { Box, Button, Stack, FormLabel, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';
import BasicAggregation from './components/BasicAggregation';
import { endOfDay, startOfDay } from 'date-fns';

const Aggregations = () => {
    const [valueForReset, setValueForReset] = useState<DateObject[]>();
    const [dateRange, setDateRange] = useState<DateObject[]>([]);

    const [aggregation, setAggregation] = useState<ActionTrackAggregation>();

    const { isLoading, activeActions, getActions } = useActionContext();

    const selectedDatesCount = dateRange.length < 2 ? 0 : dateRange[1].toDays() - dateRange[0].toDays() + 1;

    const aggregate = () => {
        if (dateRange.length < 2) return;
        const from = startOfDay(dateRange[0].toDate());
        const to = endOfDay(dateRange[1].toDate());
        ActionTrackAPI.aggregation({ range: { from, to } }).then(res => {
            setAggregation(res.data);
        });
    };
    useEffect(() => {
        if (isLoading) return;
        if (activeActions === undefined) getActions();
    }, [activeActions, getActions, isLoading]);
    return (
        <BasePage pageName="Aggregation">
            <Box sx={{ pb: 12, pt: 4 }}>
                <Stack direction="row" mb={1} justifyContent="center">
                    <FormLabel sx={{ minWidth: '65px' }}>range</FormLabel>
                    <DatePicker range value={valueForReset} onChange={range => setDateRange(range)} disabled={isLoading} onClose={aggregate} />
                    <FormLabel sx={{ minWidth: '65px' }}>{selectedDatesCount}日</FormLabel>
                </Stack>
                <Button
                    onClick={() => {
                        setValueForReset([]);
                        setDateRange([]);
                        setAggregation(undefined);
                    }}
                    disabled={isLoading}
                >
                    Clear
                </Button>
                <Box sx={{ mt: 2 }}>
                    {isLoading ? (
                        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                    ) : (
                        <BasicAggregation aggregations={aggregation?.durations_by_action} selectedDatesCount={selectedDatesCount} />
                    )}
                </Box>
            </Box>
        </BasePage>
    );
};

export default Aggregations;
