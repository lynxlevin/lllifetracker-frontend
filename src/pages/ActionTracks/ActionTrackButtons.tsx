import { Grid2 as Grid } from '@mui/material';
import ActionTrackButton from './ActionTrackButton';
import type { Action } from '../../types/action';

interface ActionTrackButtonsProps {
    actions: Action[];
}

const ActionTrackButtons = ({ actions }: ActionTrackButtonsProps) => {
    return (
        <Grid container spacing={1} sx={{ pb: 2 }}>
            {actions
                ?.filter(action => action.trackable)
                .map(action => (
                    <ActionTrackButton key={action.id} action={action} />
                ))}
        </Grid>
    );
};

export default ActionTrackButtons;
