import styled from '@emotion/styled';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../../types/action_track';
import StopIcon from '@mui/icons-material/Stop';
import PendingIcon from '@mui/icons-material/Pending';
import useActionTrackContext from '../../../hooks/useActionTrackContext';
import ActionTrackDialog from '../dialogs/actions/ActionTrackDialog';
import useActionContext from '../../../hooks/useActionContext';

interface ActiveActionTrackProps {
    actionTrack: ActionTrackType;
}

const ActiveActionTrack = ({ actionTrack }: ActiveActionTrackProps) => {
    const { stopTrackingWithState } = useActionTrackContext();
    const [displayTime, setDisplayTime] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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

    return (
        <>
            <StyledCard elevation={1}>
                <Stack direction='row' alignItems='center'>
                    <Box sx={{ flexGrow: 1 }} onClick={() => setIsDialogOpen(true)}>
                        <Typography>
                            <span style={{ color: action?.color, paddingRight: '2px' }}>⚫︎</span>
                            {action?.name}：{displayTime}
                        </Typography>
                    </Box>
                    <IconButton
                        size='medium'
                        onClick={() => {
                            stopTrackingWithState(actionTrack, setIsLoading);
                        }}
                    >
                        {isLoading ? <PendingIcon /> : <StopIcon />}
                    </IconButton>
                </Stack>
            </StyledCard>
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
