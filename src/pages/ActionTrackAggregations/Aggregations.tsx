import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, IconButton, Checkbox, ButtonGroup } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';
import { sub, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

type DateRangeType = '今日' | '今週' | '先週' | '今月' | '先月';

const Aggregations = () => {
    const [selected, setSelected] = useState<string[]>([]);

    const { isLoading, getActions, actions } = useActionContext();

    const [dateRange, setDateRange] = useState({ from: startOfDay(new Date()), to: endOfDay(new Date()) });
    const [aggregation, setAggregation] = useState<ActionTrackAggregation>();

    const onClickDateRangeTypeButton = (dateRangeType: DateRangeType) => {
        const now = new Date();
        switch (dateRangeType) {
            case '今日':
                setDateRange({ from: startOfDay(now), to: endOfDay(now) });
                break;
            case '今週':
                setDateRange({ from: startOfDay(startOfWeek(now)), to: endOfDay(endOfWeek(now)) });
                break;
            case '先週':
                setDateRange({ from: startOfDay(sub(startOfWeek(now), { weeks: 1 })), to: endOfDay(sub(endOfWeek(now), { weeks: 1 })) });
                break;
            case '今月':
                setDateRange({ from: startOfDay(startOfMonth(now)), to: endOfDay(endOfMonth(now)) });
                break;
            case '先月':
                setDateRange({ from: startOfDay(sub(startOfMonth(now), { months: 1 })), to: endOfDay(sub(endOfMonth(now), { months: 1 })) });
                break;
        }
    };

    const aggregate = () => {
        ActionTrackAPI.aggregation(dateRange.from, dateRange.to).then(res => {
            setAggregation(res.data);
        });
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
                <Box sx={{ mb: 2 }}>
                    <ButtonGroup>
                        <Button
                            onClick={() => {
                                onClickDateRangeTypeButton('今日');
                            }}
                        >
                            今日
                        </Button>
                        <Button
                            onClick={() => {
                                onClickDateRangeTypeButton('今週');
                            }}
                        >
                            今週
                        </Button>
                        <Button
                            onClick={() => {
                                onClickDateRangeTypeButton('先週');
                            }}
                        >
                            先週
                        </Button>
                        <Button
                            onClick={() => {
                                onClickDateRangeTypeButton('今月');
                            }}
                        >
                            今月
                        </Button>
                        <Button
                            onClick={() => {
                                onClickDateRangeTypeButton('先月');
                            }}
                        >
                            先月
                        </Button>
                    </ButtonGroup>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <MobileDatePicker
                        label='Start'
                        value={dateRange.from}
                        onChange={newValue =>
                            newValue !== null &&
                            setDateRange(prev => {
                                return { from: newValue, to: prev.to };
                            })
                        }
                        sx={{ width: '150px' }}
                    />
                    <MobileDatePicker
                        label='End'
                        value={dateRange.to}
                        onChange={newValue =>
                            newValue !== null &&
                            setDateRange(prev => {
                                return { from: prev.from, to: endOfDay(newValue) };
                            })
                        }
                        sx={{ width: '150px' }}
                    />
                </Box>
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
