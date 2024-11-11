import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import type { ObjectiveWithActions } from '../../types/objective';
import type { Action } from '../../types/action';

interface ActionDialogProps {
    onClose: () => void;
    objective?: ObjectiveWithActions;
    action?: Action;
}

const ActionDialog = ({ onClose, objective, action }: ActionDialogProps) => {
    const [name, setName] = useState(action ? action.name : '');

    const { addAction, updateAction } = useAmbitionContext();

    const handleSubmit = () => {
        if (objective !== undefined) {
            addAction(objective.id, name);
        } else if (action !== undefined) {
            updateAction(action.id, name);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {objective !== undefined ? (
                    <>
                        <Typography variant='h5'>Add Action</Typography>
                        <Typography>Objective name: </Typography>
                        <Typography>{objective.name}</Typography>
                    </>
                ) : (
                    <Typography variant='h5'>Edit Action</Typography>
                )}
                <TextField value={name} onChange={event => setName(event.target.value)} label='Name' fullWidth sx={{ marginTop: 1 }} />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant='contained' onClick={handleSubmit}>
                        Submit
                    </Button>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        Cancel
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default ActionDialog;
