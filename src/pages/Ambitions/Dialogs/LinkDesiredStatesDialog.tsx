import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../../types/ambition';
import useDesiresStateContext from '../../../hooks/useDesiredStateContext';
import Loading from '../../Loading';

interface LinkDesiredStatesDialogProps {
    onClose: () => void;
    ambition: AmbitionWithLinks;
}

const LinkDesiredStatesDialog = ({ onClose, ambition }: LinkDesiredStatesDialogProps) => {
    const linkedDesiredStateIds = ambition.desired_states.map(desiredState => desiredState.id);
    const [selectedDesiredStateIds, setSelectedDesiredStateIds] = useState<string[]>(linkedDesiredStateIds);

    const { linkDesiredStates, unlinkDesiredStates } = useAmbitionContext();
    const { isLoading, desiredStates, getDesiredStates } = useDesiresStateContext();

    const handleSubmit = async () => {
        const desiredStateIdsToUnlink = linkedDesiredStateIds.filter(id => !selectedDesiredStateIds.includes(id));
        await unlinkDesiredStates(ambition.id, desiredStateIdsToUnlink);

        const desiredStateIdsToLink = selectedDesiredStateIds.filter(id => !linkedDesiredStateIds.includes(id));
        await linkDesiredStates(ambition.id, desiredStateIdsToLink, true);
        onClose();
    };

    useEffect(() => {
        if (desiredStates === undefined && !isLoading) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getDesiredStates, desiredStates]);

    if (isLoading) {
        return <Loading />;
    }
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>{ambition.name}</Typography>
                <Typography variant='h6'>Link desiredStates</Typography>
                <FormGroup>
                    {desiredStates?.map(desiredState => {
                        return (
                            <FormControlLabel
                                key={desiredState.id}
                                label={desiredState.name}
                                control={
                                    <Checkbox
                                        key={desiredState.id}
                                        checked={selectedDesiredStateIds.includes(desiredState.id)}
                                        onChange={event => {
                                            setSelectedDesiredStateIds(prev => {
                                                const toBe = [...prev];
                                                if (event.target.checked) {
                                                    toBe.push(desiredState.id);
                                                } else {
                                                    const index = toBe.indexOf(desiredState.id);
                                                    toBe.splice(index, 1);
                                                }
                                                return toBe;
                                            });
                                        }}
                                    />
                                }
                            />
                        );
                    })}
                </FormGroup>
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

export default LinkDesiredStatesDialog;
