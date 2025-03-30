import { Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { useCallback, useEffect, useState } from 'react';
import type { ActionTrack } from '../../../types/action_track';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

interface ActionTrackDialogProps {
    onClose: () => void;
    actionTrack: ActionTrack;
}

const ActionTrackDialog = ({ onClose, actionTrack }: ActionTrackDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [startedAt, setStartedAt] = useState(new Date(actionTrack.started_at));
    const [endedAt, setEndedAt] = useState(actionTrack.ended_at !== null ? new Date(actionTrack.ended_at) : null);
    const [displayTime, setDisplayTime] = useState('');

    const { updateActionTrack, deleteActionTrack } = useActionTrackContext();
    const getDate = (date: Date | null) => {
        if (date === null) return '';
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    };

    const stripSeconds = (time: Date | null): Date | null => {
        if (time === null) return null;
        time.setSeconds(0);
        time.setMilliseconds(0);
        return time;
    };

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    const countTime = useCallback((startedAt: Date | null, endedAt: Date | null) => {
        if (startedAt === null) return '';
        const end = endedAt ?? new Date();
        const duration = (end.getTime() - startedAt.getTime()) / 1000;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setDisplayTime(countTime(startedAt, endedAt)), 250);
        return () => clearInterval(interval);
    }, [countTime, endedAt, startedAt]);

    const handleSubmit = () => {
        updateActionTrack(actionTrack.id, startedAt!, endedAt, actionTrack.action_id);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 4 }}>
                <Typography variant='h4' mb={2}>
                    {displayTime}
                </Typography>
                <Typography variant='h5' mb={2}>
                    <span style={actionTrack.action_color ? { color: actionTrack.action_color } : {}}>⚫︎</span>
                    {actionTrack.action_name}
                </Typography>
                <Typography variant='body1' mb={1}>
                    {getDate(startedAt)}
                </Typography>
                <MobileDateTimePicker
                    ampm={false}
                    openTo='minutes'
                    format='HH:mm:ss'
                    label='Started At'
                    value={startedAt}
                    onChange={newValue => setStartedAt(stripSeconds(newValue)!)}
                    sx={{ mb: 2 }}
                />
                <Button size='small' onClick={() => setStartedAt(new Date())} sx={{ verticalAlign: 'bottom' }}>
                    Now
                </Button>
                <br />
                {getDate(startedAt) !== getDate(endedAt) && (
                    <Typography variant='body1' mb={1}>
                        {getDate(endedAt)}
                    </Typography>
                )}
                <MobileDateTimePicker
                    ampm={false}
                    openTo='minutes'
                    format='HH:mm:ss'
                    label='Ended At'
                    value={endedAt}
                    onChange={newValue => setEndedAt(stripSeconds(newValue))}
                />
                <Button size='small' onClick={() => setEndedAt(new Date())} sx={{ verticalAlign: 'bottom' }}>
                    Now
                </Button>
                <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
                    <Button variant='outlined' onClick={() => setIsDialogOpen(true)} color='error'>
                        削除
                    </Button>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={handleSubmit} disabled={endedAt !== null && startedAt! >= endedAt}>
                        保存
                    </Button>
                </DialogActions>
            </DialogContent>
            {isDialogOpen && (
                <ConfirmationDialog
                    onClose={() => {
                        setIsDialogOpen(false);
                    }}
                    handleSubmit={() => {
                        deleteActionTrack(actionTrack.id);
                        setIsDialogOpen(false);
                        onClose();
                    }}
                    title='Delete Action Track'
                    message='This Action Track will be permanently deleted. Would you like to proceed?'
                    actionName='Delete'
                />
            )}
        </Dialog>
    );
};

export default ActionTrackDialog;
