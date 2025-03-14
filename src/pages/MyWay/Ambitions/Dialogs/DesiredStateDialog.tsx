import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../../../types/ambition';
import type { DesiredStateWithActions } from '../../../../types/desired_state';

interface DesiredStateDialogProps {
    onClose: () => void;
    ambition?: AmbitionWithLinks;
    desiredState?: DesiredStateWithActions;
}

const DesiredStateDialog = ({ onClose, ambition, desiredState }: DesiredStateDialogProps) => {
    const [name, setName] = useState(desiredState ? desiredState.name : '');
    const [description, setDescription] = useState<string>(desiredState?.description ?? '');

    const { addDesiredState, updateDesiredState } = useAmbitionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (ambition !== undefined) {
            addDesiredState(ambition.id, name, descriptionNullable);
        } else if (desiredState !== undefined) {
            updateDesiredState(desiredState.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {ambition !== undefined && (
                    <>
                        <Typography variant='h5'>Add DesiredState</Typography>
                        <Typography>Ambition name: </Typography>
                        <Typography>{ambition.name}</Typography>
                    </>
                )}
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
