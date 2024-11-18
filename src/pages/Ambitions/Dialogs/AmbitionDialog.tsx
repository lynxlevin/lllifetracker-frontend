import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../../types/ambition';

interface AmbitionDialogProps {
    onClose: () => void;
    ambition?: AmbitionWithLinks;
}

const AmbitionDialog = ({ onClose, ambition }: AmbitionDialogProps) => {
    const [name, setName] = useState(ambition ? ambition.name : '');
    const [description, setDescription] = useState<string>(ambition?.description ?? '');

    const { createAmbition, updateAmbition } = useAmbitionContext();

    const handleSubmit = () => {
        const descriptionNullable = description === '' ? null : description;
        if (ambition === undefined) {
            createAmbition(name, descriptionNullable);
        } else {
            updateAmbition(ambition.id, name, descriptionNullable);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {ambition === undefined ? <Typography variant='h5'>Add Ambition</Typography> : <Typography variant='h5'>Edit Ambition</Typography>}
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

export default AmbitionDialog;
