import { Card, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PendingIcon from '@mui/icons-material/Pending';
import type { Action } from '../../types/action';
import { useState } from 'react';

interface ActionTrackButtonProps {
    action: Action;
}

const ActionTrackButton = ({ action }: ActionTrackButtonProps) => {
    const { activeActionTracks, startTrackingWithState } = useActionTrackContext();
    const [isLoading, setIsLoading] = useState(false);
    const startTracking = () => {
        const found = activeActionTracks?.map(track => track.action_id).find(id => action.id === id);
        if (found !== undefined) return;
        startTrackingWithState(action.id, setIsLoading);
    };

    return (
        <Grid size={6}>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 1 }} onClick={startTracking}>
                <Typography variant='body2'>{action.name}</Typography>
                <IconButton size='small'>{isLoading ? <PendingIcon /> : <PlayArrowIcon />}</IconButton>
            </Card>
        </Grid>
    );
};

export default ActionTrackButton;
