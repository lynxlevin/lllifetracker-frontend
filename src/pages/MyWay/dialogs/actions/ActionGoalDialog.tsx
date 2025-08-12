import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import type { ActionWithGoal } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import { useState } from 'react';

interface ActionGoalDialogProps {
    onClose: () => void;
    action: ActionWithGoal;
}

const ActionGoalDialog = ({ onClose, action }: ActionGoalDialogProps) => {
    const [durationSeconds, setDurationSeconds] = useState<number>(action.goal?.duration_seconds ?? 0);
    const [count, setCount] = useState<number>(action.goal?.count ?? 0);

    const { setActionGoal } = useActionContext();

    const handleSubmit = () => {
        setActionGoal({
            action_id: action.id,
            duration_seconds: action.track_type === 'TimeSpan' ? durationSeconds : null,
            count: action.track_type === 'Count' ? count : null,
        });
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {action.track_type === 'TimeSpan' ? (
                    <TextField
                        label="1日の目標 (分)"
                        value={durationSeconds / 60}
                        type="number"
                        onChange={event => {
                            const value = event.target.value === '' ? 0 : Number(event.target.value);
                            if (value < 0) return setDurationSeconds(0);
                            setDurationSeconds(value * 60);
                        }}
                        variant="standard"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                ) : (
                    <TextField
                        label="1日の目標 (回)"
                        value={count}
                        type="number"
                        onChange={event => {
                            const value = event.target.value === '' ? 0 : Number(event.target.value);
                            setCount(value);
                        }}
                        variant="standard"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                    キャンセル
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={durationSeconds + count === 0}>
                    目標設定する
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActionGoalDialog;
