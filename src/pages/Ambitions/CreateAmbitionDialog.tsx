import { Button, Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';

interface CreateAmbitionDialogProps {
    onClose: () => void;
}

const CreateAmbitionDialog = (props: CreateAmbitionDialogProps) => {
    const { onClose } = props;
    const [name, setName] = useState('');
    const [description, setDescription] = useState<string>();

    const { createAmbition } = useAmbitionContext();

    const handleSubmit = async () => {
        await createAmbition(name, description);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <TextField value={name} onChange={event => setName(event.target.value)} label='Name' fullWidth />
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

export default CreateAmbitionDialog;
