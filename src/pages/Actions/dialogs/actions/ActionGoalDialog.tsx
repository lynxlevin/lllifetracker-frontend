import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import type { ActionWithGoal } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import { useState } from 'react';

interface ActionGoalDialogProps {
    onClose: () => void;
    action: ActionWithGoal;
}

const ActionGoalDialog = ({ onClose, action }: ActionGoalDialogProps) => {
    const [durationSeconds, setDurationSeconds] = useState<number>(action.goal?.duration_seconds ?? 0);
    const [count, setCount] = useState<number>(action.goal?.count ?? 0);

    const { setActionGoal, removeActionGoal } = useActionContext();

    const handleSubmit = () => {
        if (durationSeconds + count === 0) {
            if (action.goal !== null) removeActionGoal(action.id);
        } else {
            setActionGoal({
                action_id: action.id,
                duration_seconds: action.track_type === 'TimeSpan' ? durationSeconds : null,
                count: action.track_type === 'Count' ? count : null,
            });
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {action.track_type === 'TimeSpan' ? (
                    <TextField
                        label="1日の目標 (分)"
                        defaultValue={durationSeconds / 60}
                        type="number"
                        onChange={event => {
                            setDurationSeconds(Number(event.target.value) * 60);
                        }}
                        variant="standard"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                ) : (
                    <TextField
                        label="1日の目標 (回)"
                        defaultValue={count}
                        type="number"
                        onChange={event => {
                            setCount(Number(event.target.value));
                        }}
                        variant="standard"
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                )}
                {action.goal !== null && (
                    <Button
                        size="small"
                        sx={{ marginLeft: 1 }}
                        onClick={() => {
                            removeActionGoal(action.id);
                            onClose();
                        }}
                    >
                        <>
                            <RamenDiningIcon />
                            おやすみする
                        </>
                    </Button>
                )}
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                    キャンセル
                </Button>
                <Button variant="contained" onClick={handleSubmit}>
                    目標設定する
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ActionGoalDialog;
