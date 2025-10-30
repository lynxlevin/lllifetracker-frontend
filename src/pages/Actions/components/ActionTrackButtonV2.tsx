import { Card, Grid, Stack, Typography } from '@mui/material';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import InfoIcon from '@mui/icons-material/Info';
import type { ActionFull } from '../../../types/my_way';
import { useState } from 'react';
import ActionDialogV2 from '../dialogs/actions/ActionDialogV2';
import { grey } from '@mui/material/colors';
import ActionFocusDialog from '../dialogs/actions/ActionFocusDialog';
import { getDurationString } from '../../../hooks/useValueDisplay';

interface ActionTrackButtonV2Props {
    action: ActionFull;
    disabled?: boolean;
    columns: 1 | 2 | 3;
}

type DialogType = 'Details' | 'Focus';

const ActionTrackButtonV2 = ({ action, disabled = false, columns }: ActionTrackButtonV2Props) => {
    const { activeActionTracks, startTracking } = useActionTrackContext();
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

    const getDisplayValue = () => {
        if (action.track_type === 'Count') {
            return action.aggregation.countForTheDay > 0 ? `(${action.aggregation.countForTheDay})` : '';
        }
        if (action.track_type === 'TimeSpan') {
            const duration = getDurationString(action.aggregation.durationForTheDay, true);
            return duration ? `(${duration})` : '';
        }
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
            <Card sx={{ borderRadius: '14px', backgroundColor: disabled ? 'background.default' : '#fff', height: '2.5rem' }} elevation={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" height="100%">
                    <Stack direction="row" alignItems="center" flexGrow={1} onClick={handleStartButton} pl="2px" sx={{ overflow: 'hidden' }}>
                        {getStartButtonIcon()}
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
                            flexGrow={1}
                        >
                            <Typography
                                fontSize={styling.nameFontSize}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', textAlign: 'left', flexGrow: 1 }}
                            >
                                {action.name}
                            </Typography>
                            <Stack>
                                <Typography fontSize="0.8rem" pl="2px" fontWeight={100}>
                                    {getDisplayValue()}
                                </Typography>
                                {action.trackable && action.remainingMiles !== null && (
                                    <Typography fontSize="0.6rem" fontWeight={100}>
                                        {action.remainingMiles <= 0
                                            ? '達成🎉'
                                            : action.track_type === 'TimeSpan'
                                              ? `あと${action.remainingMiles}分`
                                              : `あと${action.remainingMiles}回`}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack direction="row" alignItems="center" pr={1} py={1} pl={0.5} onClick={() => setOpenedDialog('Details')}>
                        <InfoIcon sx={{ color: grey[500], fontSize: '1em' }} />
                    </Stack>
                </Stack>
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

export default ActionTrackButtonV2;
