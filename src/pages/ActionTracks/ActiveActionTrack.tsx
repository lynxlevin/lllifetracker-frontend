import styled from '@emotion/styled';
import { Box, Card, IconButton, Stack, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../types/action_track';
import StopIcon from '@mui/icons-material/Stop';
import PendingIcon from '@mui/icons-material/Pending';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActionTrackDialog from './Dialogs/ActionTrackDialog';

interface ActiveActionTrackProps {
    actionTrack: ActionTrackType;
}

const ActiveActionTrack = ({ actionTrack }: ActiveActionTrackProps) => {
    const { stopTrackingWithState } = useActionTrackContext();
    const [displayTime, setDisplayTime] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    const countTime = useCallback((startedAt?: Date) => {
        if (startedAt === undefined) return '';
        const now = new Date();
        const duration = (now.getTime() - startedAt.getTime()) / 1000;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setDisplayTime(countTime(actionTrack.startedAt)), 250);
        return () => clearInterval(interval);
    }, [actionTrack.startedAt, countTime]);

    return (
        <>
            <StyledCard elevation={1}>
                <Stack direction='row' alignItems='center'>
                    <Box sx={{ flexGrow: 1 }} onClick={() => setIsDialogOpen(true)}>
                        <Typography>
                            {actionTrack.action_name && <span style={{ color: actionTrack.action_color!, paddingRight: '2px' }}>⚫︎</span>}
                            {actionTrack.action_name}：{displayTime}
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
            {isDialogOpen && <ActionTrackDialog onClose={() => setIsDialogOpen(false)} actionTrack={actionTrack} />}
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
