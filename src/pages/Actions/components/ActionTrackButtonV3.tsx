import { Divider, IconButton, Stack, Typography } from '@mui/material';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import type { ActionFull } from '../../../types/my_way';
import { useState } from 'react';
import ActionDialogV2 from '../dialogs/actions/ActionDialogV2';
import ActionFocusDialog from '../dialogs/actions/ActionFocusDialog';
import { getDurationString } from '../../../hooks/useValueDisplay';

interface ActionTrackButtonV3Props {
    action: ActionFull;
}

type DialogType = 'Details' | 'Focus';

const ActionTrackButtonV3 = ({ action }: ActionTrackButtonV3Props) => {
    const { activeActionTracks, startTracking } = useActionTrackContext();
    const [isLoading, setIsLoading] = useState(false);
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const disabled = !action.trackable;

    const getStartButtonIcon = () => {
        if (isLoading)
            return (
                <IconButton size="large" sx={{ height: '2.5rem' }}>
                    <PendingIcon sx={{ color: action.color }} />
                </IconButton>
            );
        switch (action.track_type) {
            case 'TimeSpan':
                // MYMEMO: Add stop button if there's any active.
                return (
                    <IconButton size="large" sx={{ height: '2.5rem' }} onClick={handleStartButton}>
                        <PlayArrowIcon sx={{ color: disabled ? '#212121' : action.color }} />
                    </IconButton>
                );
            case 'Count':
                return (
                    <IconButton size="large" sx={{ height: '2.5rem' }} onClick={handleStartButton}>
                        <CheckCircleIcon sx={{ color: disabled ? '#212121' : action.color, fontSize: '1.2rem', width: '1.5rem' }} />
                    </IconButton>
                );
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
        switch (action.track_type) {
            case 'TimeSpan':
                return getDurationString(action.aggregation.durationForTheDay, true) ?? '0:00';
            case 'Count':
                return `(${action.aggregation.countForTheDay})`;
        }
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
        <>
            <Stack direction="row" alignItems="center" sx={{ overflow: 'hidden' }}>
                {getStartButtonIcon()}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }} flexGrow={1}>
                    <Typography
                        fontSize="1rem"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', textAlign: 'left', flexGrow: 1 }}
                        onClick={() => setOpenedDialog('Details')}
                    >
                        {action.remainingMiles !== null && action.remainingMiles <= 0 && '🎉'}
                        {action.name}
                    </Typography>
                    <Stack width="5rem">
                        <Typography fontSize="0.9rem" fontWeight={100}>
                            {getDisplayValue()}
                        </Typography>
                        {action.trackable && action.remainingMiles !== null && (
                            // MYMEMO: Add successive days of achievement.
                            // MYMEMO: Add Goal edit menu
                            <Typography fontSize="0.7rem" fontWeight={100}>
                                {action.remainingMiles <= 0
                                    ? '達成🎉'
                                    : action.track_type === 'TimeSpan'
                                      ? `あと${getDurationString(action.remainingMiles * 60, true)}`
                                      : `あと${action.remainingMiles}回`}
                            </Typography>
                        )}
                    </Stack>
                </Stack>
            </Stack>
            {openedDialog && getDialog()}
            <Divider />
        </>
    );
};

export default ActionTrackButtonV3;
