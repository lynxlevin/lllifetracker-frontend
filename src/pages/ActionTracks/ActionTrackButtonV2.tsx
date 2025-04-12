import { Card, Grid2 as Grid, Stack, Typography } from '@mui/material';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import InfoIcon from '@mui/icons-material/Info';
import type { Action } from '../../types/action';
import { useState } from 'react';
import ActionDialogV2 from '../MyWay/Actions/Dialogs/ActionDialogV2';
import { grey } from '@mui/material/colors';
import ActionFocusDialog from './Dialogs/ActionFocusDialog';

interface ActionTrackButtonV2Props {
    action: Action;
    disabled?: boolean;
    columns: 1 | 2 | 3;
}

type DialogType = 'Details' | 'Focus';

const ActionTrackButtonV2 = ({ action, disabled = false, columns }: ActionTrackButtonV2Props) => {
    const { activeActionTracks, startTracking, dailyAggregation } = useActionTrackContext();
    const [isLoading, setIsLoading] = useState(false);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getStartButtonIcon = () => {
        if (isLoading) return <PendingIcon sx={{ color: action.color }} />;
        switch (action.track_type) {
            case 'TimeSpan':
                return <PlayArrowIcon sx={{ color: disabled ? '#212121' : action.color }} />;
            case 'Count':
                return <CheckCircleIcon sx={{ color: disabled ? '#212121' : action.color, fontSize: '1.2rem', width: '1.5rem' }} />;
        }
    };

    const handleStartButton = () => {
        if (disabled) return;
        const found = activeActionTracks?.map(track => track.action_id).find(id => action.id === id);
        if (found !== undefined) return;
        startTracking(action, setIsLoading);
        // FIXME: This should wait for startTracking to finish
        if (action.description) setOpenedDialog('Focus');
    };
    const totalForTheDay = dailyAggregation?.durations_by_action.find(agg => agg.action_id === action.id)?.duration;

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

    const getDialog = () => {
        switch (openedDialog) {
            case 'Details':
                return <ActionDialogV2 action={action} onClose={() => setOpenedDialog(undefined)} />;
            case 'Focus':
                return <ActionFocusDialog action={action} onClose={() => setOpenedDialog(undefined)} />;
        }
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
                        {getStartButtonIcon()}
                        <Typography
                            fontSize={styling.nameFontSize}
                            overflow='hidden'
                            textOverflow='ellipsis'
                            sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', flexGrow: 1, textAlign: 'left' }}
                        >
                            {action.name}
                        </Typography>
                        <Typography fontSize='0.8rem' pl='2px' fontWeight={100}>
                            {getDuration(totalForTheDay)}
                        </Typography>
                    </Stack>
                    <Stack direction='row' alignItems='center' pr={1} py={1}>
                        <InfoIcon onClick={() => setOpenedDialog('Details')} sx={{ color: grey[500], fontSize: '1.2em' }} />
                    </Stack>
                </Stack>
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

export default ActionTrackButtonV2;
