import styled from '@emotion/styled';
import { Box, Card, Collapse, IconButton, Stack, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../../types/action_track';
import StopIcon from '@mui/icons-material/Stop';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import ActionTrackDialog from '../dialogs/actions/ActionTrackDialog';
import useActionContext from '../../../hooks/useActionContext';
import { grey } from '@mui/material/colors';
import { TransitionGroup } from 'react-transition-group';
import HorizontalSwipeBox from '../../../components/HorizontalSwipeBox';

interface ActiveActionTrackProps {
    actionTrack: ActionTrackType;
    signalOpenedDialog?: (dialog: string, action: 'Open' | 'Close') => void;
}

const ActiveActionTrack = ({ actionTrack, signalOpenedDialog }: ActiveActionTrackProps) => {
    const { stopTrackingWithState, deleteActionTrack } = useActionTrackContext();
    const [displayTime, setDisplayTime] = useState('');
    const [isDialogOpen, _setIsDialogOpen] = useState(false);
    const setIsDialogOpen = (flag: boolean) => {
        _setIsDialogOpen(flag);
        if (signalOpenedDialog !== undefined) signalOpenedDialog(`ActiveActionTrack:${actionTrack.id}:ActionTrackDialog`, flag ? 'Open' : 'Close');
    };
    const [isLoading, setIsLoading] = useState(false);

    const { actions } = useActionContext();
    const action = actions?.find(act => act.id === actionTrack.action_id)!;

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    const countTime = useCallback((startedAt: string | null) => {
        if (startedAt === null) return '';
        const now = new Date();
        const duration = (now.getTime() - new Date(startedAt).getTime()) / 1000;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setDisplayTime(countTime(actionTrack.started_at)), 250);
        return () => clearInterval(interval);
    }, [actionTrack.started_at, countTime]);

    const [swipedLeft, setSwipedLeft] = useState(false);
    return (
        <>
            <HorizontalSwipeBox onSwipeLeft={swiped => setSwipedLeft(swiped)}>
                <StyledCard elevation={1} sx={{ flexGrow: 1 }}>
                    <Stack direction="row">
                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{ flexGrow: 1 }}
                            onClick={() => {
                                stopTrackingWithState(actionTrack, setIsLoading);
                            }}
                        >
                            <IconButton loading={isLoading} size="medium" sx={{ color: action?.color }}>
                                <StopIcon />
                            </IconButton>
                            <Box>
                                <Typography>
                                    {action?.name}：{displayTime}
                                </Typography>
                            </Box>
                        </Stack>
                        <TransitionGroup>
                            <Stack direction="row">
                                <IconButton size="medium" onClick={() => setIsDialogOpen(true)}>
                                    <InfoIcon sx={{ color: grey[500] }} />
                                </IconButton>
                                {swipedLeft && (
                                    <Collapse in={swipedLeft} orientation="horizontal">
                                        <IconButton sx={{ ml: 2 }} color="error" onClick={() => deleteActionTrack(actionTrack.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Collapse>
                                )}
                            </Stack>
                        </TransitionGroup>
                    </Stack>
                </StyledCard>
            </HorizontalSwipeBox>
            {isDialogOpen && (
                <ActionTrackDialog
                    onClose={() => {
                        setIsDialogOpen(false);
                    }}
                    actionTrack={actionTrack}
                />
            )}
        </>
    );
};

const StyledCard = styled(Card)`
    height: 100%;
    border-radius: 999px;
    text-align: left;
    border: solid 2px lightgray;
    padding: 6px 8px;
`;

export default memo(ActiveActionTrack);
