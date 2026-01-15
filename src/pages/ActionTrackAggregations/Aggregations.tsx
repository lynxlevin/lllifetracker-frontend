import { Box, Button, Stack, FormLabel } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import DatePicker, { type DateObject } from 'react-multi-date-picker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';
import BasicAggregation from './components/BasicAggregation';
import { endOfDay, startOfDay } from 'date-fns';

type DatePickerType = 'MultiSelect' | 'Range' | 'None';

const Aggregations = () => {
    const [valueForReset, setValueForReset] = useState<DateObject[]>();
    const [dates, setDates] = useState<DateObject[]>([]);
    const [dateRange, setDateRange] = useState<DateObject[]>([]);

    const [aggregation, setAggregation] = useState<ActionTrackAggregation>();

    const { isLoading, getActions, actions } = useActionContext();

    const activeDatePicker: DatePickerType = useMemo(() => {
        if (dates.length > 0) return 'MultiSelect';
        if (dateRange.length > 1) return 'Range';
        return 'None';
    }, [dateRange.length, dates.length]);

    const selectedDatesCount = useMemo(() => {
        switch (activeDatePicker) {
            case 'MultiSelect':
                return dates.length;
            case 'Range':
                return dateRange[1].toDays() - dateRange[0].toDays() + 1;
            case 'None':
                return 0;
        }
    }, [activeDatePicker, dateRange, dates.length]);

    const aggregate = () => {
        if (dateRange.length > 0) {
            const from = startOfDay(dateRange[0].toDate());
            const to = endOfDay(dateRange[1].toDate());
            ActionTrackAPI.aggregation({ range: { from, to } }).then(res => {
                setAggregation(res.data);
            });
        } else if (dates.length > 0) {
            ActionTrackAPI.aggregation({ multiple: dates }).then(res => setAggregation(res.data));
        }
    };

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage isLoading={isLoading} pageName="Aggregation">
            <Box sx={{ pb: 12, pt: 4 }}>
                <Stack direction="row" mb={1} justifyContent="center">
                    <FormLabel sx={{ minWidth: '65px' }} disabled={activeDatePicker === 'Range'}>
                        multiple
                    </FormLabel>
                    <DatePicker
                        multiple
                        value={valueForReset}
                        onChange={dates => setDates(dates)}
                        disabled={activeDatePicker === 'Range'}
                        onClose={aggregate}
                    />
                    <FormLabel sx={{ minWidth: '65px' }} disabled={activeDatePicker === 'Range'}>
                        {selectedDatesCount}日
                    </FormLabel>
                </Stack>
                <Stack direction="row" mb={1} justifyContent="center">
                    <FormLabel sx={{ minWidth: '65px' }} disabled={activeDatePicker === 'MultiSelect'}>
                        range
                    </FormLabel>
                    <DatePicker
                        range
                        value={valueForReset}
                        onChange={range => setDateRange(range)}
                        disabled={activeDatePicker === 'MultiSelect'}
                        onClose={aggregate}
                    />
                    <FormLabel sx={{ minWidth: '65px' }} disabled={activeDatePicker === 'MultiSelect'}>
                        {selectedDatesCount}日
                    </FormLabel>
                </Stack>
                <Button
                    onClick={() => {
                        setValueForReset([]);
                        setDateRange([]);
                        setDates([]);
                    }}
                >
                    Clear
                </Button>
                <Box sx={{ mt: 2 }}>
                    <BasicAggregation aggregations={aggregation?.durations_by_action} selectedDatesCount={selectedDatesCount} />
                </Box>
            </Box>
        </BasePage>
    );
};

export default Aggregations;
