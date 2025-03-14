import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import type { DesiredStateWithActions } from '../../../../types/desired_state';
import type { Action } from '../../../../types/action';

interface ActionDialogProps {
    onClose: () => void;
    desiredState?: DesiredStateWithActions;
    action?: Action;
}

const ActionDialog = ({ onClose, desiredState, action }: ActionDialogProps) => {
    const [name, setName] = useState(action ? action.name : '');
    const [description, setDescription] = useState<string>(action?.description ?? '');

    const { addAction, updateAction } = useAmbitionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (desiredState !== undefined) {
            addAction(desiredState.id, name, descriptionNullable);
        } else if (action !== undefined) {
            updateAction(action.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {desiredState !== undefined ? (
                    <>
                        <Typography variant='h5'>Add Action</Typography>
                        <Typography>DesiredState name: </Typography>
                        <Typography>{desiredState.name}</Typography>
                    </>
                ) : (
                    <Typography variant='h5'>Edit Action</Typography>
                )}
                <TextField value={name} onChange={event => setName(event.target.value)} label='Name' fullWidth sx={{ marginTop: 1 }} />
                <TextField
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    label='Description'
                    multiline
                    fullWidth
                    minRows={5}
                    sx={{ marginTop: 1 }}
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <>
                    <Button variant='outlined' onClick={onClose} sx={{ color: 'primary.dark' }}>
                        Cancel
                    </Button>
                    <Button variant='contained' onClick={handleSubmit}>
                        Submit
                    </Button>
                </>
            </DialogActions>
        </Dialog>
    );
};

export default ActionDialog;
