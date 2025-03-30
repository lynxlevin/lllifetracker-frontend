import { Card, Grid2 as Grid, Typography } from '@mui/material';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PendingIcon from '@mui/icons-material/Pending';
import type { Action } from '../../types/action';
import { useState } from 'react';

interface ActionTrackButtonProps {
    action: Action;
    columns: 1 | 2;
}

const ActionTrackButton = ({ action, columns }: ActionTrackButtonProps) => {
    const { activeActionTracks, startTracking, dailyAggregation } = useActionTrackContext();
    const [isLoading, setIsLoading] = useState(false);
    const handleStartButton = () => {
        const found = activeActionTracks?.map(track => track.action_id).find(id => action.id === id);
        if (found !== undefined) return;
        startTracking(action.id, setIsLoading);
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

    const styling = {
        gridSize: 12 / columns,
        nameFontSize: columns === 1 ? '1rem' : '0.9rem',
    };

    return (
        <Grid size={styling.gridSize}>
            <Card sx={{ display: 'flex', alignItems: 'center', py: 1, px: '4px', borderRadius: '14px' }} elevation={2} onClick={handleStartButton}>
                {isLoading ? <PendingIcon sx={{ color: action.color }} /> : <PlayArrowIcon sx={{ color: action.color }} />}
                <Typography
                    fontSize={styling.nameFontSize}
                    whiteSpace='nowrap'
                    overflow='hidden'
                    textOverflow='ellipsis'
                    sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}
                >
                    {action.name}
                </Typography>
                <Typography fontSize='0.8rem' pl='2px' fontWeight={100}>
                    {getDuration(totalForToday)}
                </Typography>
            </Card>
        </Grid>
    );
};

export default ActionTrackButton;
