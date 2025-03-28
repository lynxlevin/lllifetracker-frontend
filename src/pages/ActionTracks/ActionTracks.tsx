import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import BasePage from '../../components/BasePage';
import ActionTrack from './ActionTrack';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import useActionContext from '../../hooks/useActionContext';
import ActionTrackButtons from './ActionTrackButtons';
import ActiveActionTracks from './ActiveActionTracks';

const ActionTracks = () => {
    const { isLoading: isLoadingActionTrack, getActionTracksForHome, actionTracksForTheDay, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();

    const isLoading = isLoadingActionTrack || isLoadingActions;

    useEffect(() => {
        if ([actionTracksForTheDay, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracksForHome();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracksForHome]);

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage isLoading={isLoading} pageName='ActionTracks'>
            <Box sx={{ pt: 3 }}>
                {actions && <ActionTrackButtons actions={actions} />}
                {actionTracksForTheDay !== undefined && actionTracksForTheDay.length > 0 && (
                    <Box>
                        <Stack direction='row' justifyContent='space-between'>
                            <Typography>{actionTracksForTheDay[0].date}</Typography>
                            {/* <Button variant='text'>全履歴表示</Button> */}
                        </Stack>
                        <Grid container spacing={1}>
                            {actionTracksForTheDay.map(actionTrack => {
                                if (actionTrack.endedAt !== undefined) {
                                    return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />;
                                }
                                return <div key={actionTrack.id} />;
                            })}
                        </Grid>
                    </Box>
                )}
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom={112} />}
            </Box>
        </BasePage>
    );
};

export default ActionTracks;
