import { Grid2 as Grid } from '@mui/material';
import { useEffect } from 'react';
import useActionContext from '../../hooks/useActionContext';
import ActionTrackButton from './ActionTrackButton';

const ActionTrackButtons = () => {
    const { isLoading, getActions, actions } = useActionContext();

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
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
