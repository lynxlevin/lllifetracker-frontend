import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';

interface AddObjectiveDialogProps {
    onClose: () => void;
    ambitionId: string;
}

const AddObjectiveDialog = (props: AddObjectiveDialogProps) => {
    const { onClose, ambitionId } = props;
    const [name, setName] = useState('');

    const { addObjective } = useAmbitionContext();

    const handleSubmit = () => {
        addObjective(ambitionId, name);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <TextField value={name} onChange={event => setName(event.target.value)} label='Name' fullWidth />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
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
