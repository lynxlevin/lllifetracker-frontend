import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import ActionTrack from './ActionTrack';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActiveActionTrack from './ActiveActionTrack';

const ActionTracks = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, getActionTracks, actionTracksByDate, activeActionTracks } = useActionTrackContext();

    useEffect(() => {
        if ((actionTracksByDate === undefined || activeActionTracks === undefined) && !isLoading && isLoggedIn) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksByDate, activeActionTracks, getActionTracks]);
    return (
        <BasePage isLoading={isLoading} pageName='ActionTracks'>
            <Box sx={{ pb: 4 }}>
                <Grid container spacing={0.5}>
                    {actionTracksByDate?.map(actionTracks => (
                        <>
                            <Typography key={`date-${actionTracks[0].date}`}>{actionTracks[0].date}</Typography>
                            {actionTracks
                                .filter(actionTrack => actionTrack.ended_at !== null)
                                .map(actionTrack => (
                                    <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />
                                ))}
                        </>
                    ))}
                    {activeActionTracks && (
                        <Stack
                            sx={{
                                position: 'fixed',
                                bottom: '58px',
                                left: 0,
                                right: 0,
                                padding: 0.5,
                            }}
                            spacing={0.5}
                        >
                            {activeActionTracks?.map(actionTrack => (
                                <ActiveActionTrack key={actionTrack.id} actionTrack={actionTrack} />
                            ))}
                        </Stack>
                    )}
                </Grid>
            </Box>
        </BasePage>
    );
};

export default ActionTracks;
