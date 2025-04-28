import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Snackbar,
    IconButton,
    Checkbox,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';
import { sub, startOfDay, endOfDay, startOfMonth, startOfWeek, endOfWeek, endOfMonth } from 'date-fns';

type FromThisDate = '今日から' | '今週頭から' | '先週頭から' | '今月頭から' | '先月頭から' | '一週間前から' | '一月前から';
type ToThisDate = '今日まで' | '先週末まで' | '先月末まで';

const Aggregations = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [fromThisDate, setFromThisDate] = useState<FromThisDate>('今日から');
    const [toThisDate, setToThisDate] = useState<ToThisDate>('今日まで');

    const { isLoading, getActions, actions } = useActionContext();

    const [startsAt, setStartsAt] = useState(startOfDay(new Date()));
    const [endsAt, setEndsAt] = useState(endOfDay(new Date()));
    const [aggregation, setAggregation] = useState<ActionTrackAggregation>();

    const onChangeFromThisDate = (event: SelectChangeEvent) => {
        if (!event.target.value) return;
        const value = event.target.value as FromThisDate;
        const now = new Date();
        setFromThisDate(value);
        switch (value) {
            case '今日から':
                setStartsAt(startOfDay(now));
                break;
            case '今週頭から':
                setStartsAt(startOfDay(startOfWeek(now)));
                break;
            case '先週頭から':
                setStartsAt(startOfDay(sub(startOfWeek(now), { weeks: 1 })));
                break;
            case '今月頭から':
                setStartsAt(startOfDay(startOfMonth(now)));
                break;
            case '先月頭から':
                setStartsAt(startOfDay(sub(startOfMonth(now), { months: 1 })));
                break;
            case '一週間前から':
                setStartsAt(startOfDay(sub(now, { weeks: 1 })));
                break;
            case '一月前から':
                setStartsAt(startOfDay(sub(now, { months: 1 })));
                break;
        }
    };

    const onChangeToThisDate = (event: SelectChangeEvent) => {
        if (!event.target.value) return;
        const value = event.target.value as ToThisDate;
        const now = new Date();
        setToThisDate(value);
        switch (event.target.value) {
            case '今日まで':
                setEndsAt(endOfDay(now));
                break;
            case '先週末まで':
                setEndsAt(endOfDay(sub(endOfWeek(now), { weeks: 1 })));
                break;
            case '先月末まで':
                setEndsAt(endOfDay(sub(endOfMonth(now), { months: 1 })));
                break;
        }
    };

    const aggregate = () => {
        ActionTrackAPI.aggregation(startsAt, endsAt).then(res => {
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
                    <Button
                        variant='outlined'
                        sx={{ mr: 1 }}
                        onClick={() => {
                            const now = new Date();
                            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                            setStartsAt(firstDay);
                            setEndsAt(lastDay);
                        }}
                    >
                        今月
                    </Button>
                    <Button
                        variant='outlined'
                        onClick={() => {
                            const now = new Date();
                            const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                            const lastDay = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
                            setStartsAt(firstDay);
                            setEndsAt(lastDay);
                        }}
                    >
                        先月
                    </Button>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Select value={fromThisDate} onChange={onChangeFromThisDate}>
                        <MenuItem value='今日から'>今日から</MenuItem>
                        <MenuItem value='今週頭から'>今週頭から</MenuItem>
                        <MenuItem value='先週頭から'>先週頭から</MenuItem>
                        <MenuItem value='今月頭から'>今月頭から</MenuItem>
                        <MenuItem value='先月頭から'>先月頭から</MenuItem>
                        <MenuItem value='一週間前から'>一週間前から</MenuItem>
                        <MenuItem value='一月前から'>一月前から</MenuItem>
                    </Select>
                    <Select value={toThisDate} onChange={onChangeToThisDate}>
                        <MenuItem value='今日まで'>今日まで</MenuItem>
                        <MenuItem value='先週末まで'>先週末まで</MenuItem>
                        <MenuItem value='先月末まで'>先月末まで</MenuItem>
                    </Select>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <MobileDatePicker
                        label='Start'
                        value={startsAt}
                        onChange={newValue => newValue !== null && setStartsAt(startOfDay(newValue))}
                        sx={{ width: '150px' }}
                    />
                    <MobileDatePicker
                        label='End'
                        value={endsAt}
                        onChange={newValue => newValue !== null && setEndsAt(endOfDay(newValue))}
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
