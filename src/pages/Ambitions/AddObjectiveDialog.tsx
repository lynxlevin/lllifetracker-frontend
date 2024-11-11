import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../types/ambition';

interface AddObjectiveDialogProps {
    onClose: () => void;
    ambition: AmbitionWithLinks;
}

const AddObjectiveDialog = (props: AddObjectiveDialogProps) => {
    const { onClose, ambition } = props;
    const [name, setName] = useState('');

    const { addObjective } = useAmbitionContext();

    const handleSubmit = () => {
        addObjective(ambition.id, name);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>Add Objective</Typography>
                <Typography>Ambition name: </Typography>
                <Typography>{ambition.name}</Typography>
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

export default AddObjectiveDialog;
