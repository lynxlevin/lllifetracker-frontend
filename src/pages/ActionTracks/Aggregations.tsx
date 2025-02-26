import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useEffect, useState } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { ActionTrackAPI } from '../../apis/ActionTrackAPI';
import type { ActionTrackAggregation } from '../../types/action_track';

const Aggregations = () => {
    const [selected, setSelected] = useState<string[]>([]);

    const { isLoggedIn } = useUserAPI();
    const { isLoading, getActions, actions } = useActionContext();

    const getBeginning = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    };

    const getEnd = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
    };

    const [startsAt, setStartsAt] = useState(getBeginning(new Date()));
    const [endsAt, setEndsAt] = useState(getEnd(new Date()));
    const [aggregation, setAggregation] = useState<ActionTrackAggregation>();

    const aggregate = () => {
        ActionTrackAPI.aggregation(startsAt, endsAt).then(res => {
            setAggregation(res.data);
        });
    };

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getDuration = (duration?: number) => {
        if (duration === undefined) return '-';
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    };

    const handleClickRow = (event: React.MouseEvent<unknown>, id: string) => {
        const existingIndex = selected.indexOf(id);
        if (existingIndex === -1) {
            setSelected(prev => [...prev, id]);
        } else {
            setSelected(prev => [...prev.slice(0, existingIndex), ...prev.slice(existingIndex + 1)]);
        }
    };

    useEffect(() => {
        if (actions === undefined && !isLoading && isLoggedIn) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage pageName='ActionTracks'>
            <Box sx={{ pb: 4, pt: 4 }}>
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
                <MobileDatePicker label='Start' value={startsAt} onChange={newValue => newValue !== null && setStartsAt(getBeginning(newValue))} />
                <br />
                <MobileDatePicker label='End' value={endsAt} onChange={newValue => newValue !== null && setEndsAt(getEnd(newValue))} />
                <br />
                <Button onClick={aggregate}>Aggregate</Button>
                <Box sx={{ mt: 2 }}>
                    <TableContainer component={Box}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>行動</TableCell>
                                    <TableCell align='right'>合計</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {actions
                                    ?.filter(action => action.trackable)
                                    .map(action => (
                                        <TableRow
                                            key={action.id}
                                            hover
                                            selected={selected.includes(action.id)}
                                            onClick={event => handleClickRow(event, action.id)}
                                        >
                                            <TableCell component='th' scope='row'>
                                                {action.name}
                                            </TableCell>
                                            <TableCell align='right'>
                                                {getDuration(aggregation?.durations_by_action.find(agg => agg.action_id === action.id)?.duration)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </BasePage>
    );
};

export default Aggregations;
