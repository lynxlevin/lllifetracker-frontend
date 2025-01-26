import styled from '@emotion/styled';
import { Box, Card, Chip, Grid2 as Grid, IconButton, Typography } from '@mui/material';
import { memo, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../types/action_track';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActionTrackDialog from './Dialogs/ActionTrackDialog';

interface ActionTrackProps {
    actionTrack: ActionTrackType;
}
type DialogType = 'Edit' | 'Delete';

const ActionTrack = ({ actionTrack }: ActionTrackProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { deleteActionTrack } = useActionTrackContext();

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

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ActionTrackDialog onClose={() => setOpenedDialog(undefined)} actionTrack={actionTrack} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteActionTrack(actionTrack.id);
                            setOpenedDialog(undefined);
                        }}
                        title='Delete Action Track'
                        message='This Action Track will be permanently deleted. Would you like to proceed?'
                        actionName='Delete'
                    />
                );
        }
    };

    return (
        <>
            <StyledGrid size={12} onClick={() => setOpenedDialog('Edit')}>
                <Card className='card'>
                    <Box className='card-content'>
                        <div>
                            <Typography>
                                {getTime(actionTrack.startedAt)} ~ {getTime(actionTrack.endedAt)}
                                {actionTrack.duration && getDuration(actionTrack.duration)}
                            </Typography>
                            {actionTrack.action_name && <Chip label={actionTrack.action_name} />}
                        </div>
                        <IconButton size='small' onClick={() => setOpenedDialog('Delete')}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Card>
            </StyledGrid>
            {openedDialog && getDialog()}
        </>
    );
};

const StyledGrid = styled(Grid)`
    .card {
        height: 100%;
        display: flex;
        flex-direction: column;
        position: relative;
        text-align: left;
        background-color: #fcfcfc;
    }
    .card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
    }
`;

export default memo(ActionTrack);
