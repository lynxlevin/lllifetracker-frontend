import { Button, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import type { AmbitionWithLinks } from '../../../types/ambition';
import useObjectiveContext from '../../../hooks/useObjectiveContext';
import Loading from '../../Loading';

interface LinkObjectivesDialogProps {
    onClose: () => void;
    ambition: AmbitionWithLinks;
}

const LinkObjectivesDialog = ({ onClose, ambition }: LinkObjectivesDialogProps) => {
    const linkedObjectiveIds = ambition.objectives.map(objective => objective.id);
    const [selectedObjectiveIds, setSelectedObjectiveIds] = useState<string[]>(linkedObjectiveIds);

    const { linkObjectives, unlinkObjectives } = useAmbitionContext();
    const { isLoading, objectives, getObjectives } = useObjectiveContext();

    const handleSubmit = async () => {
        const objectiveIdsToUnlink = linkedObjectiveIds.filter(id => !selectedObjectiveIds.includes(id));
        await unlinkObjectives(ambition.id, objectiveIdsToUnlink);

        const objectiveIdsToLink = selectedObjectiveIds.filter(id => !linkedObjectiveIds.includes(id));
        await linkObjectives(ambition.id, objectiveIdsToLink, true);
        onClose();
    };

    useEffect(() => {
        if (objectives === undefined && !isLoading) getObjectives();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getObjectives, objectives]);

    if (isLoading) {
        return <Loading />;
    }
    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Typography variant='h5'>{ambition.name}</Typography>
                <Typography variant='h6'>Link objectives</Typography>
                <FormGroup>
                    {objectives?.map(objective => {
                        return (
                            <FormControlLabel
                                key={objective.id}
                                label={objective.name}
                                control={
                                    <Checkbox
                                        key={objective.id}
                                        checked={selectedObjectiveIds.includes(objective.id)}
                                        onChange={event => {
                                            setSelectedObjectiveIds(prev => {
                                                const toBe = [...prev];
                                                if (event.target.checked) {
                                                    toBe.push(objective.id);
                                                } else {
                                                    const index = toBe.indexOf(objective.id);
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

export default LinkObjectivesDialog;
