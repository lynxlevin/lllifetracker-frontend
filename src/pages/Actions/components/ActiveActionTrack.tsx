import styled from '@emotion/styled';
import { Box, Button, Card, Collapse, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../../types/action_track';
import StopIcon from '@mui/icons-material/Stop';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import ActionTrackDialog from '../dialogs/actions/ActionTrackDialog';
import useActionContext from '../../../hooks/useActionContext';
import { grey } from '@mui/material/colors';
import { TransitionGroup } from 'react-transition-group';
import useHorizontalSwipe from '../../../hooks/useHorizontalSwipe';
import { addSeconds } from 'date-fns';

interface ActiveActionTrackProps {
    actionTrack: ActionTrackType;
    signalOpenedDialog?: (dialog: string, action: 'Open' | 'Close') => void;
}

const ActiveActionTrack = ({ actionTrack, signalOpenedDialog }: ActiveActionTrackProps) => {
    const theme = useTheme();
    const isWideScreen = useMediaQuery(theme.breakpoints.up('sm'));

    const { stopTracking, refreshTracking, deleteActionTrack } = useActionTrackContext();
    const { swipedLeft, swipedRight, cancelSwipe, HorizontalSwipeBox } = useHorizontalSwipe();
    const [displayTime, setDisplayTime] = useState('');
    const [showCancelButton, setShowCancelButton] = useState<boolean>();
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

    const countTime = useCallback((startedAtProp: string | null) => {
        if (startedAtProp === null) return '';
        const startedAt = new Date(startedAtProp);
        const now = new Date();
        const isPlus = startedAt <= now;
        const duration = (isPlus ? now.getTime() - startedAt.getTime() : startedAt.getTime() - now.getTime()) / 1000;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return `${isPlus ? '' : '-'}${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }, []);

    useEffect(() => {
        const startedAtPlus5s = addSeconds(new Date(actionTrack.started_at), 5);
        if (new Date() > startedAtPlus5s) {
            setShowCancelButton(false);
            return;
        } else {
            setShowCancelButton(true);
        }
        const interval = setInterval(() => {
            if (new Date() > startedAtPlus5s) {
                setShowCancelButton(false);
                clearInterval(interval);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [actionTrack.started_at]);
    useEffect(() => {
        const interval = setInterval(() => setDisplayTime(countTime(actionTrack.started_at)), 250);
        return () => clearInterval(interval);
    }, [actionTrack.started_at, countTime]);
    return (
        <>
            <HorizontalSwipeBox distance={75}>
                <StyledCard
                    elevation={1}
                    onClick={() => {
                        stopTracking(actionTrack, setIsLoading).catch(_ => {});
                    }}
                >
                    <Stack direction="row">
                        <TransitionGroup>
                            {(swipedRight || isWideScreen) && (
                                <Collapse in={swipedRight} orientation="horizontal">
                                    <IconButton
                                        sx={{ ml: 2 }}
                                        onClick={e => {
                                            e.stopPropagation();
                                            refreshTracking(actionTrack)
                                                .then(cancelSwipe)
                                                .catch(_ => {});
                                        }}
                                    >
                                        <RefreshIcon />
                                    </IconButton>
                                </Collapse>
                            )}
                        </TransitionGroup>
                        <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
                            <IconButton loading={isLoading} size="medium" sx={{ color: action?.color }}>
                                <StopIcon />
                            </IconButton>
                            <Box>
                                <Typography>
                                    {action?.name}：{displayTime}
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row">
                            {!isWideScreen && showCancelButton && (
                                <Button
                                    sx={{ ml: 2 }}
                                    onClick={e => {
                                        e.stopPropagation();
                                        deleteActionTrack(actionTrack).catch(_ => {});
                                    }}
                                >
                                    取りやめ
                                </Button>
                            )}
                            <IconButton
                                size="medium"
                                onClick={e => {
                                    e.stopPropagation();
                                    setIsDialogOpen(true);
                                }}
                            >
                                <InfoIcon sx={{ color: grey[500] }} />
                            </IconButton>
                            <TransitionGroup>
                                {(swipedLeft || isWideScreen) && (
                                    <Collapse in={swipedLeft} orientation="horizontal">
                                        <IconButton
                                            sx={{ ml: 2 }}
                                            color="error"
                                            onClick={e => {
                                                e.stopPropagation();
                                                deleteActionTrack(actionTrack).catch(_ => {});
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Collapse>
                                )}
                            </TransitionGroup>
                        </Stack>
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
