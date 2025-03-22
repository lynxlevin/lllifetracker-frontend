import { Card, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PendingIcon from '@mui/icons-material/Pending';
import type { Action } from '../../types/action';
import { useState } from 'react';
import { amber } from '@mui/material/colors';

interface ActionTrackButtonProps {
    action: Action;
}

const ActionTrackButton = ({ action }: ActionTrackButtonProps) => {
    const { activeActionTracks, startTrackingWithState, dailyAggregation } = useActionTrackContext();
    const [isLoading, setIsLoading] = useState(false);
    const startTracking = () => {
        const found = activeActionTracks?.map(track => track.action_id).find(id => action.id === id);
        if (found !== undefined) return;
        startTrackingWithState(action.id, setIsLoading);
    };
    const totalForToday = dailyAggregation?.durations_by_action.find(agg => agg.action_id === action.id)?.duration;

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getDuration = (duration?: number) => {
        if (duration === undefined) return '';
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        return `(${hours}:${zeroPad(minutes)})`;
    };

    return (
        <Grid size={6}>
            <Card sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 1 }} onClick={startTracking}>
                <Typography variant='body2' align='left'>
                    <span style={{ color: amber[500] }}>⚫︎</span>
                    {action.name} {getDuration(totalForToday)}
                </Typography>
                <IconButton size='small'>{isLoading ? <PendingIcon /> : <PlayArrowIcon />}</IconButton>
            </Card>
        </Grid>
    );
};

export default ActionTrackButton;
