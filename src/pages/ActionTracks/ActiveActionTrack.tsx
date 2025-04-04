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
    const { stopTrackingWithState, createdTrackActionIdList, removeFromCreatedTrackActionIdList } = useActionTrackContext();
    const [displayTime, setDisplayTime] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(actionTrack.action_id ? createdTrackActionIdList.includes(actionTrack.action_id) : false);
    const [isLoading, setIsLoading] = useState(false);
    const shouldHideTimeInput = actionTrack.action_id ? createdTrackActionIdList.includes(actionTrack.action_id) : false;

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
            {isDialogOpen && (
                <ActionTrackDialog
                    onClose={() => {
                        removeFromCreatedTrackActionIdList(actionTrack.action_id);
                        setIsDialogOpen(false);
                    }}
                    actionTrack={actionTrack}
                    shouldHideTimeInput={shouldHideTimeInput}
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
