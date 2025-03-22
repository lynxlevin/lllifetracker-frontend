import styled from '@emotion/styled';
import { Box, Card, Grid2 as Grid, Typography } from '@mui/material';
import { memo, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../types/action_track';
import ActionTrackDialog from './Dialogs/ActionTrackDialog';

interface ActionTrackProps {
    actionTrack: ActionTrackType;
}
type DialogType = 'Edit' | 'Delete';

const ActionTrack = ({ actionTrack }: ActionTrackProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };
    const getTime = (date?: Date) => {
        if (date === undefined) return '';
        return `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`;
    };

    const getDuration = (duration: number) => {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return ` (${hours}:${zeroPad(minutes)}:${zeroPad(seconds)})`;
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ActionTrackDialog onClose={() => setOpenedDialog(undefined)} actionTrack={actionTrack} />;
        }
    };

    return (
        <>
            <StyledGrid size={12} onClick={() => setOpenedDialog('Edit')}>
                <Card className='card'>
                    <Box className='card-content'>
                        <Typography>
                            {getTime(actionTrack.startedAt)} ~ {getTime(actionTrack.endedAt)}
                            {actionTrack.duration && getDuration(actionTrack.duration)}：
                            {actionTrack.action_name && <span style={{ color: actionTrack.action_color! }}>⚫︎</span>}
                            {actionTrack.action_name}
                        </Typography>
                    </Box>
                </Card>
            </StyledGrid>
            {openedDialog && getDialog()}
        </>
    );
};

const StyledGrid = styled(Grid)`
    .card {
        background-color: #fcfcfc;
    }
    .card-content {
        padding: 12px;
    }
`;

export default memo(ActionTrack);
