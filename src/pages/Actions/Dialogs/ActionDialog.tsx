import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import type { ActionWithLinks } from '../../../types/action';
import useActionContext from '../../../hooks/useActionContext';

interface ActionDialogProps {
    onClose: () => void;
    action?: ActionWithLinks;
}

const ActionDialog = ({ onClose, action }: ActionDialogProps) => {
    const [name, setName] = useState(action ? action.name : '');
    const [description, setDescription] = useState<string>(action?.description ?? '');

    const { createAction, updateAction } = useActionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (action === undefined) {
            createAction(name, descriptionNullable);
        } else {
            updateAction(action.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {action !== undefined && <Typography variant='h5'>Edit Action</Typography>}
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
