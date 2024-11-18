import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import Loading from '../../Loading';
import type { ObjectiveWithActions } from '../../../types/objective';
import useActionContext from '../../../hooks/useActionContext';

interface LinkActionsDialogProps {
    onClose: () => void;
    objective: ObjectiveWithActions;
}

const LinkActionsDialog = ({ onClose, objective }: LinkActionsDialogProps) => {
    const linkedActionIds = objective.actions.map(action => action.id);
    const [selectedActionIds, setSelectedActionIds] = useState<string[]>(linkedActionIds);

    const { linkActions, unlinkActions } = useAmbitionContext();
    const { isLoading, actions, getActions } = useActionContext();

    const handleSubmit = async () => {
        const actionIdsToUnlink = linkedActionIds.filter(id => !selectedActionIds.includes(id));
        await unlinkActions(objective.id, actionIdsToUnlink);

        const actionIdsToLink = selectedActionIds.filter(id => !linkedActionIds.includes(id));
        await linkActions(objective.id, actionIdsToLink, true);
        onClose();
    };

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getActions, actions]);

    if (isLoading) {
        return <Loading />;
    }
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>{objective.name}</Typography>
                <Typography variant='h6'>Link actions</Typography>
                <FormGroup>
                    {actions?.map(action => {
                        return (
                            <FormControlLabel
                                key={action.id}
                                label={action.name}
                                control={
                                    <Checkbox
                                        key={action.id}
                                        checked={selectedActionIds.includes(action.id)}
                                        onChange={event => {
                                            setSelectedActionIds(prev => {
                                                const toBe = [...prev];
                                                if (event.target.checked) {
                                                    toBe.push(action.id);
                                                } else {
                                                    const index = toBe.indexOf(action.id);
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

export default LinkActionsDialog;
