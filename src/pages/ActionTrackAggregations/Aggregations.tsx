import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, FormLabel } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import DatePicker, { type DateObject } from 'react-multi-date-picker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';
import { useNavigate } from 'react-router-dom';

type DatePickerType = 'MultiSelect' | 'Range' | 'None';

const Aggregations = () => {
    const [valueForReset, setValueForReset] = useState<DateObject[]>();
    const [dates, setDates] = useState<DateObject[]>([]);
    const [dateRange, setDateRange] = useState<DateObject[]>([]);

    const [aggregation, setAggregation] = useState<ActionTrackAggregation>();

    const { isLoading, getActions, actions } = useActionContext();
    const navigate = useNavigate();

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
            ActionTrackAPI.aggregation({ range: { from: dateRange[0].toDate(), to: dateRange[1].toDate() } }).then(res => {
                setAggregation(res.data);
            });
        } else if (dates.length > 0) {
            ActionTrackAPI.aggregation({ multiple: dates }).then(res => setAggregation(res.data));
        }
    };

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getDuration = (duration?: number) => {
        if (duration === undefined || duration === 0) return '-';
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    };

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage isLoading={isLoading} pageName='ActionTracks'>
            <Box sx={{ pb: 12, pt: 4 }}>
                <Stack direction='row' mb={1} justifyContent='center'>
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
                <Stack direction='row' mb={1} justifyContent='center'>
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
                    <TableContainer component={Box}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell align='right'>時間</TableCell>
                                    <TableCell align='right'>時間/選択日数</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {actions
                                    ?.filter(action => action.trackable)
                                    .map(action => {
                                        const duration = aggregation?.durations_by_action.find(agg => agg.action_id === action.id)?.duration;
                                        return (
                                            <TableRow key={action.id}>
                                                <TableCell component='th' scope='row'>
                                                    <span style={{ color: action.color }}>⚫︎</span>
                                                    {action.name}
                                                </TableCell>
                                                <TableCell align='right'>{getDuration(duration)}</TableCell>
                                                <TableCell align='right'>{duration === undefined ? '-' : getDuration(duration / selectedDatesCount)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack direction='row' justifyContent='space-between'>
                        <Box />
                        <Button
                            onClick={() => {
                                navigate('/action-tracks/aggregations/old');
                                window.scroll({ top: 0 });
                            }}
                        >
                            旧バージョンへ
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </BasePage>
    );
};

export default Aggregations;
