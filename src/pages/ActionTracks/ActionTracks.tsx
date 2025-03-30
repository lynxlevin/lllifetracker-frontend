import { Box, Button, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import BasePage from '../../components/BasePage';
import ActionTrack from './ActionTrack';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import useActionContext from '../../hooks/useActionContext';
import ActionTrackButtons from './ActionTrackButtons';
import ActiveActionTracks from './ActiveActionTracks';
import { format } from 'date-fns';
import ActionTrackHistoryDialog from './Dialogs/ActionTrackHistoryDialog';

const ActionTracks = () => {
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksForTheDay, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();

    const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);

    const isLoading = isLoadingActionTrack || isLoadingActions;

    useEffect(() => {
        if ([actionTracksForTheDay, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksForTheDay, activeActionTracks, getActionTracks]);

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage isLoading={isLoading} pageName='ActionTracks'>
            <Box sx={{ pt: 3 }}>
                {actions && <ActionTrackButtons actions={actions} />}
                <Box>
                    <Stack direction='row' justifyContent='space-between'>
                        <Typography>{format(new Date(), 'yyyy-MM-dd E')}</Typography>
                        <Button variant='text' onClick={() => setIsHistoryDialogOpen(true)}>
                            全履歴表示
                        </Button>
                    </Stack>
                    {actionTracksForTheDay !== undefined && actionTracksForTheDay.length > 0 && (
                        <Grid container spacing={1}>
                            {actionTracksForTheDay.map(actionTrack => {
                                if (actionTrack.ended_at !== null) {
                                    return <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />;
                                }
                                return <div key={actionTrack.id} />;
                            })}
                        </Grid>
                    )}
                </Box>
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom={112} />}
                {isHistoryDialogOpen && <ActionTrackHistoryDialog onClose={() => setIsHistoryDialogOpen(false)} />}
            </Box>
        </BasePage>
    );
};

export default ActionTracks;
