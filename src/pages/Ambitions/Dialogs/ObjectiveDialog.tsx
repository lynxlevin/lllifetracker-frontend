import { Button, Dialog, DialogActions, DialogContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../../types/ambition';
import type { ObjectiveWithActions } from '../../../types/objective';

interface ObjectiveDialogProps {
    onClose: () => void;
    ambition?: AmbitionWithLinks;
    objective?: ObjectiveWithActions;
}

const ObjectiveDialog = ({ onClose, ambition, objective }: ObjectiveDialogProps) => {
    const [name, setName] = useState(objective ? objective.name : '');

    const { addObjective, updateObjective } = useAmbitionContext();

    const handleSubmit = () => {
        if (ambition !== undefined) {
            addObjective(ambition.id, name);
        } else if (objective !== undefined) {
            updateObjective(objective.id, name);
        }
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                {ambition !== undefined && (
                    <>
                        <Typography variant='h5'>Add Objective</Typography>
                        <Typography>Ambition name: </Typography>
                        <Typography>{ambition.name}</Typography>
                    </>
                )}
                {objective !== undefined && <Typography variant='h5'>Edit Objective</Typography>}
                <TextField value={name} onChange={event => setName(event.target.value)} label='Name' fullWidth sx={{ marginTop: 1 }} />
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

export default ObjectiveDialog;
