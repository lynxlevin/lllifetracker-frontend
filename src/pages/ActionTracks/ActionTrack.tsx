import styled from '@emotion/styled';
import { Card, CardContent, Chip, Grid2 as Grid, Typography } from '@mui/material';
import { memo } from 'react';
import type { ActionTrack as ActionTrackType } from '../../types/action_track';

interface ActionTrackProps {
    actionTrack: ActionTrackType;
}

const ActionTrack = ({ actionTrack }: ActionTrackProps) => {
    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getTime = (date?: Date) => {
        if (date === undefined) return '';
        return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}:${zeroPad(date.getSeconds())}`;
    };

    const getDuration = (duration: number) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return ` (${hours}:${zeroPad(minutes)}:${zeroPad(seconds)})`;
    };

    return (
        <StyledGrid size={12}>
            <Card className='card'>
                <CardContent className='card-content'>
                    <Typography>
                        {getTime(actionTrack.startedAt)} ~ {getTime(actionTrack.endedAt)}
                        {actionTrack.duration && getDuration(actionTrack.duration)}
                    </Typography>
                    {actionTrack.action_name && <Chip label={actionTrack.action_name} />}
                </CardContent>
            </Card>
        </StyledGrid>
    );
};

const StyledGrid = styled(Grid)`
    .card {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        text-align: left;
    }
    .card-content {
        padding: 12px;
    }
`;

export default memo(ActionTrack);
