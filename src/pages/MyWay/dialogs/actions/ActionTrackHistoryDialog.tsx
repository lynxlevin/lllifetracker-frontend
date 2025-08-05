import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../../../types/action_track';
import styled from '@emotion/styled';
import ActionTrack from '../../components/ActionTrack';
import { ActionTrackAPI } from '../../../../apis/ActionTrackAPI';
import { format } from 'date-fns';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface ActionTrackHistoryDialogProps {
    onClose: () => void;
}

const ActionTrackHistoryDialog = ({ onClose }: ActionTrackHistoryDialogProps) => {
    const [actionTracksByDate, setActionTracksByDate] = useState<ActionTrackType[][]>();

    useEffect(() => {
        ActionTrackAPI.listByDate().then(res => {
            setActionTracksByDate(res.data);
        });
    }, []);
    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h5">活動履歴</Typography>}
            content={
                actionTracksByDate === undefined ? (
                    <Box
                        sx={{
                            height: '100vh',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {actionTracksByDate.map(actionTracks => {
                            return (
                                <StyledBox key={`date-for-${actionTracks[0].id}`}>
                                    <Typography>{format(new Date(actionTracks[0].started_at), 'yyyy-MM-dd E')}</Typography>
                                    <Grid container spacing={1}>
                                        {actionTracks.map(actionTrack => (
                                            <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />
                                        ))}
                                    </Grid>
                                </StyledBox>
                            );
                        })}
                    </>
                )
            }
        />
    );
};

const StyledBox = styled(Box)`
    text-align: left;
    padding-bottom: 8px;
`;

export default ActionTrackHistoryDialog;
