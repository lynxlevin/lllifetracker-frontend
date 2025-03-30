import { Card, Grid2 as Grid, Stack, Typography } from '@mui/material';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PendingIcon from '@mui/icons-material/Pending';
import InfoIcon from '@mui/icons-material/Info';
import type { Action } from '../../types/action';
import { useState } from 'react';
import ActionDialogV2 from '../MyWay/Actions/Dialogs/ActionDialogV2';
import { grey } from '@mui/material/colors';

interface ActionTrackButtonV2Props {
    action: Action;
    disabled?: boolean;
    columns: 1 | 2 | 3;
}

const ActionTrackButtonV2 = ({ action, disabled = false, columns }: ActionTrackButtonV2Props) => {
    const { activeActionTracks, startTracking, dailyAggregation } = useActionTrackContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
    const handleStartButton = () => {
        if (disabled) return;
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
            <Card sx={{ borderRadius: '14px', backgroundColor: disabled ? 'background.default' : '#fff' }} elevation={2}>
                <Stack direction='row' justifyContent='space-between'>
                    <Stack
                        direction='row'
                        alignItems='center'
                        flexGrow={1}
                        onClick={handleStartButton}
                        pl='4px'
                        py={1}
                        sx={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                    >
                        {isLoading ? <PendingIcon sx={{ color: action.color }} /> : <PlayArrowIcon sx={{ color: disabled ? '#212121' : action.color }} />}
                        <Typography
                            fontSize={styling.nameFontSize}
                            overflow='hidden'
                            textOverflow='ellipsis'
                            sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}
                        >
                            {action.name}
                        </Typography>
                        <Typography fontSize='0.8rem' pl='2px' fontWeight={100}>
                            {getDuration(totalForToday)}
                        </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' pr={1} py={1}>
                        <InfoIcon onClick={() => setIsDetailsDialogOpen(true)} sx={{ color: grey[500], fontSize: '1.2em' }} />
                    </Stack>
                </Stack>
            </Card>
            {isDetailsDialogOpen && <ActionDialogV2 action={action} onClose={() => setIsDetailsDialogOpen(false)} />}
        </Grid>
    );
};

export default ActionTrackButtonV2;
