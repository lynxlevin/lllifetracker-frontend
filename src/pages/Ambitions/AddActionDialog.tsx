import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import type { ObjectiveWithActions } from '../../types/objective';

interface AddActionDialogProps {
    onClose: () => void;
    objective: ObjectiveWithActions;
}

const AddActionDialog = (props: AddActionDialogProps) => {
    const { onClose, objective } = props;
    const [name, setName] = useState('');

    const { addAction } = useAmbitionContext();

    const handleSubmit = () => {
        addAction(objective.id, name);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>Add Action</Typography>
                <Typography>Objective name: </Typography>
                <Typography>{objective.name}</Typography>
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

export default AddActionDialog;
