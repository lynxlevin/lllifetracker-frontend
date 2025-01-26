import styled from '@emotion/styled';
import { Card, Chip, IconButton, Typography } from '@mui/material';
import { memo, useCallback, useEffect, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../types/action_track';
import StopIcon from '@mui/icons-material/Stop';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActionTrackDialog from './Dialogs/ActionTrackDialog';

interface ActiveActionTrackProps {
    actionTrack: ActionTrackType;
}

const ActiveActionTrack = ({ actionTrack }: ActiveActionTrackProps) => {
    const { stopTracking } = useActionTrackContext();
    const [displayTime, setDisplayTime] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
            <StyledCard elevation={1} onClick={() => setIsDialogOpen(true)}>
                <div className='card-content'>
                    <div>
                        <Typography>{displayTime}</Typography>
                        {actionTrack.action_name && <Chip label={actionTrack.action_name} />}
                    </div>
                    <IconButton
                        size='small'
                        onClick={() => {
                            stopTracking(actionTrack);
                        }}
                    >
                        <StopIcon />
                    </IconButton>
                </div>
            </StyledCard>
            {isDialogOpen && <ActionTrackDialog onClose={() => setIsDialogOpen(false)} actionTrack={actionTrack} />}
        </>
    );
};

const StyledCard = styled(Card)`
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    text-align: left;
    border: solid 2px lightgray;

    .card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
    }
`;

export default memo(ActiveActionTrack);
