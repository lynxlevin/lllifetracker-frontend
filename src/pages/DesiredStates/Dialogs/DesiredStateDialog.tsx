import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { DesiredStateWithActions } from '../../../types/desired_state';
import useDesiredStateContext from '../../../hooks/useDesiredStateContext';

interface DesiredStateDialogProps {
    onClose: () => void;
    desiredState?: DesiredStateWithActions;
}

const DesiredStateDialog = ({ onClose, desiredState }: DesiredStateDialogProps) => {
    const [name, setName] = useState(desiredState ? desiredState.name : '');
    const [description, setDescription] = useState<string>(desiredState?.description ?? '');

    const { createDesiredState, updateDesiredState } = useDesiredStateContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (desiredState === undefined) {
            createDesiredState(name, descriptionNullable);
        } else {
            updateDesiredState(desiredState.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {desiredState !== undefined && <Typography variant='h5'>Edit DesiredState</Typography>}
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

export default DesiredStateDialog;
