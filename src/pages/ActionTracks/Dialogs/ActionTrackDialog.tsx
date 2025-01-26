import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import type { ActionTrack } from '../../../types/action_track';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import ConfirmationDialog from '../../../components/ConfirmationDialog';

interface ActionTrackDialogProps {
    onClose: () => void;
    actionTrack: ActionTrack;
}

const ActionTrackDialog = ({ onClose, actionTrack }: ActionTrackDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [startedAt, setStartedAt] = useState(actionTrack.startedAt ?? null);
    const [endedAt, setEndedAt] = useState(actionTrack.endedAt ?? null);

    const { updateActionTrack, deleteActionTrack } = useActionTrackContext();
    const getDate = (date: Date | null) => {
        if (date === null) return '';
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    };

    const stripSeconds = (time: Date | null): Date | null => {
        if (time === null) return null;
        time.setSeconds(0);
        return time;
    };

    const handleSubmit = () => {
        updateActionTrack(actionTrack.id, startedAt!, endedAt, actionTrack.action_id);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ pr: 0.5, pl: 0.5, pt: 2 }}>
                {getDate(startedAt)}
                <br />
                <MobileDateTimePicker
                    openTo='minutes'
                    views={['hours', 'minutes', 'seconds']}
                    label='Started At'
                    value={startedAt}
                    onChange={newValue => setStartedAt(stripSeconds(newValue))}
                    sx={{ pb: 2 }}
                />
                <br />
                {getDate(endedAt)}
                <br />
                <MobileDateTimePicker
                    openTo='minutes'
                    views={['hours', 'minutes', 'seconds']}
                    label='Ended At'
                    value={endedAt}
                    onChange={newValue => setEndedAt(stripSeconds(newValue))}
                    sx={{ pb: 2 }}
                />
                <Button onClick={() => setEndedAt(new Date())} disabled={!!endedAt}>
                    Set Now
                </Button>
                <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button variant='outlined' onClick={() => setIsDialogOpen(true)} color='error'>
                        削除
                    </Button>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        キャンセル
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
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
