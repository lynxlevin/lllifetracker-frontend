import styled from '@emotion/styled';
import { Card, Chip, IconButton, Typography } from '@mui/material';
import { memo } from 'react';
import type { ActionTrack as ActionTrackType } from '../../types/action_track';
import StopIcon from '@mui/icons-material/Stop';

interface ActiveActionTrackProps {
    actionTrack: ActionTrackType;
}

const ActiveActionTrack = ({ actionTrack }: ActiveActionTrackProps) => {
    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    // MYMEMO: use debounce to update
    const countTime = (startedAt?: Date) => {
        if (startedAt === undefined) return '';
        const now = new Date();
        const duration = (now.getTime() - startedAt.getTime()) / 1000;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    };

    return (
        <StyledCard elevation={1}>
            <div className='card-content'>
                <div>
                    <Typography>{countTime(actionTrack.startedAt)}</Typography>
                    {actionTrack.action_name && <Chip label={actionTrack.action_name} />}
                </div>
                <IconButton size='small'>
                    <StopIcon />
                </IconButton>
            </div>
        </StyledCard>
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
