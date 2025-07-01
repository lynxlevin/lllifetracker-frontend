import styled from '@emotion/styled';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Stack, FormLabel } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import DatePicker, { type DateObject } from 'react-multi-date-picker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';

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
        <BasePage isLoading={isLoading} pageName='Aggregation'>
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
                                    <StyledTableCell align='right'>時間・回数</StyledTableCell>
                                    <StyledTableCell align='right'>1日あたり</StyledTableCell>
                                    <StyledTableCell align='right'>1回あたり</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {actions
                                    ?.filter(action => action.trackable)
                                    .map(action => {
                                        const durationsByAction = aggregation?.durations_by_action.find(agg => agg.action_id === action.id);
                                        const duration = durationsByAction?.duration ?? 0;
                                        return (
                                            <TableRow key={action.id}>
                                                <StyledTableCell component='th' scope='row'>
                                                    <span style={{ color: action.color }}>⚫︎</span>
                                                    {action.name}
                                                </StyledTableCell>
                                                <StyledTableCell align='right'>
                                                    {action.track_type === 'TimeSpan' ? getDuration(duration) : (durationsByAction?.count ?? '-')}
                                                </StyledTableCell>
                                                <StyledTableCell align='right'>
                                                    {selectedDatesCount > 0 ? getDuration(duration / selectedDatesCount) : '-'}
                                                </StyledTableCell>
                                                <StyledTableCell align='right'>
                                                    {durationsByAction === undefined ? '-' : getDuration(duration / durationsByAction.count)}
                                                </StyledTableCell>
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </BasePage>
    );
};

const StyledTableCell = styled(TableCell)`
    padding-right: 0;
    padding-left: 0;
`;

export default Aggregations;
