import { Dialog, DialogContent, Typography, Grid2 as Grid, Box, CircularProgress, Container, AppBar, Toolbar, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ActionTrack as ActionTrackType } from '../../../types/action_track';
import styled from '@emotion/styled';
import ActionTrack from '../ActionTrack';
import { ActionTrackAPI } from '../../../apis/ActionTrackAPI';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';

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
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 4, backgroundColor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>活動履歴</Typography>
                        <div style={{ flexGrow: 1 }} />
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4 }}>
                    {actionTracksByDate === undefined ? (
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
                        actionTracksByDate.map(actionTracks => {
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
                        })
                    )}
                </Container>
            </DialogContent>
        </Dialog>
    );
};

const StyledBox = styled(Box)`
    text-align: left;
    padding-bottom: 8px;
`;

export default ActionTrackHistoryDialog;
