import styled from '@emotion/styled';
import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import useUserAPI from '../../hooks/useUserAPI';
import BasePage from '../../components/BasePage';
import ActionTrack from './ActionTrack';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActiveActionTrack from './ActiveActionTrack';
import useActionContext from '../../hooks/useActionContext';
import ActionTrackButton from './ActionTrackButton';

const ActionTracks = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksByDate, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();

    const isLoading = isLoadingActionTrack || isLoadingActions;

    useEffect(() => {
        if ([actionTracksByDate, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading && isLoggedIn) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksByDate, activeActionTracks, getActionTracks]);

    useEffect(() => {
        if (actions === undefined && !isLoading && isLoggedIn) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage pageName='ActionTracks'>
            <Box sx={{ pb: 4, pt: 4 }}>
                <Grid container spacing={1} sx={{ pb: 2 }}>
                    {actions?.map(action => (
                        <ActionTrackButton key={action.id} action={action} />
                    ))}
                </Grid>
                <div style={{ paddingBottom: '50vh' }}>
                    {actionTracksByDate?.map(actionTracks => (
                        <StyledBox key={`date-${actionTracks[0].date}`}>
                            <Typography>{actionTracks[0].date}</Typography>
                            <Grid container spacing={1}>
                                {actionTracks.map(actionTrack => (
                                    <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />
                                ))}
                            </Grid>
                        </StyledBox>
                    ))}
                </div>
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
                            <ActiveActionTrack key={`active-${actionTrack.id}`} actionTrack={actionTrack} />
                        ))}
                    </Stack>
                )}
            </Box>
        </BasePage>
    );
};

const StyledBox = styled(Box)`
    text-align: left;
    padding-bottom: 8px;
`;

export default ActionTracks;
