import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, IconButton, Checkbox, Stack, FormLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import DatePicker, { type DateObject } from 'react-multi-date-picker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';
import { useNavigate } from 'react-router-dom';
import DatePanel from 'react-multi-date-picker/plugins/date_panel';

const Aggregations = () => {
    const [valueForReset, setValueForReset] = useState<DateObject[]>();
    const [dates, setDates] = useState<DateObject[]>([]);
    const [dateRange, setDateRange] = useState<DateObject[]>([]);

    const [selected, setSelected] = useState<string[]>([]);
    const [aggregation, setAggregation] = useState<ActionTrackAggregation>();

    const { isLoading, getActions, actions } = useActionContext();
    const navigate = useNavigate();

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

    const handleClickRow = (_: React.MouseEvent<unknown>, id: string) => {
        const existingIndex = selected.indexOf(id);
        if (existingIndex === -1) {
            setSelected(prev => [...prev, id]);
        } else {
            setSelected(prev => [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)]);
        }
    };

    const getSelectionSum = () => {
        return aggregation?.durations_by_action
            .filter(agg => selected.includes(agg.action_id))
            .map(agg => agg.duration)
            .reduce((acc, duration) => {
                return acc + duration;
            }, 0);
    };

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage isLoading={isLoading} pageName='ActionTracks'>
            <Box sx={{ pb: 12, pt: 4 }}>
                <Stack direction='row' mb={1} justifyContent='center'>
                    <FormLabel sx={{ minWidth: '65px' }} disabled={dateRange.length > 0}>
                        multiple
                    </FormLabel>
                    <DatePicker
                        multiple
                        value={valueForReset}
                        onChange={dates => setDates(dates)}
                        // biome-ignore lint/correctness/useJsxKeyInIterable: <explanation>
                        plugins={[<DatePanel />]}
                        sort
                        disabled={dateRange.length > 0}
                    />
                </Stack>
                <Stack direction='row' mb={1} justifyContent='center'>
                    <FormLabel sx={{ minWidth: '65px' }} disabled={dates.length > 0}>
                        range
                    </FormLabel>
                    <DatePicker value={valueForReset} onChange={range => setDateRange(range)} range disabled={dates.length > 0} />
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
                <Button onClick={aggregate}>Aggregate</Button>
                <Box sx={{ mt: 2 }}>
                    <TableContainer component={Box}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding='checkbox' />
                                    <TableCell />
                                    <TableCell align='right'>時間</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {actions
                                    ?.filter(action => action.trackable)
                                    .map(action => {
                                        const isSelected = selected.includes(action.id);
                                        const duration = getDuration(aggregation?.durations_by_action.find(agg => agg.action_id === action.id)?.duration);
                                        return (
                                            <TableRow key={action.id} selected={isSelected} onClick={event => handleClickRow(event, action.id)}>
                                                <TableCell padding='checkbox'>
                                                    <Checkbox color='primary' checked={isSelected} />
                                                </TableCell>
                                                <TableCell component='th' scope='row'>
                                                    <span style={{ color: action.color }}>⚫︎</span>
                                                    {action.name}
                                                </TableCell>
                                                <TableCell align='right'>{duration}</TableCell>
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
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{ bottom: 120 }}
                    open={selected.length > 0}
                    action={
                        <IconButton size='small' color='inherit' onClick={() => setSelected([])}>
                            <CloseIcon fontSize='small' />
                        </IconButton>
                    }
                    message={`合計: ${getDuration(getSelectionSum())}`}
                />
            </Box>
        </BasePage>
    );
};

export default Aggregations;
