import { Box, Divider, Paper, Stack } from '@mui/material';
import { useEffect } from 'react';
import BasePage from '../components/BasePage';
import useActionTrackContext from '../hooks/useActionTrackContext';
import ActionTrackButtons from './ActionTracks/ActionTrackButtons';
import useActionContext from '../hooks/useActionContext';
import ActiveActionTracks from './ActionTracks/ActiveActionTracks';
import { AmbitionTypography, DesiredStateTypography } from '../components/CustomTypography';
import useAmbitionContext from '../hooks/useAmbitionContext';
import useDesiredStateContext from '../hooks/useDesiredStateContext';

const Home = () => {
    const { isLoading: isLoadingAmbitions, getAmbitions, ambitions } = useAmbitionContext();
    const { isLoading: isLoadingDesiredStates, getDesiredStates, desiredStates } = useDesiredStateContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksByDate, activeActionTracks, dailyAggregation } = useActionTrackContext();

    const isLoading = isLoadingAmbitions || isLoadingDesiredStates || isLoadingActions || isLoadingActionTrack;

    useEffect(() => {
        if (ambitions === undefined && !isLoading) getAmbitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitions, getAmbitions]);

    useEffect(() => {
        if (desiredStates === undefined && !isLoading) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);

    useEffect(() => {
        if ([actionTracksByDate, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksByDate, activeActionTracks, getActionTracks]);
    return (
        <BasePage isLoading={isLoading} pageName='Home'>
            <Box sx={{ pt: 4 }}>
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left' }}>
                    {ambitions?.map(ambition => {
                        return (
                            <Paper key={ambition.id} sx={{ padding: 1, position: 'relative' }}>
                                <AmbitionTypography name={ambition.name} description={ambition.description} variant='h6' />
                            </Paper>
                        );
                    })}
                </Stack>
                <Divider color='#ccc' sx={{ my: 1 }} />
                <Stack spacing={1} sx={{ width: '100%', textAlign: 'left' }}>
                    {desiredStates?.map(desiredState => {
                        return (
                            <Paper key={desiredState.id} sx={{ p: 1, position: 'relative' }}>
                                <DesiredStateTypography name={desiredState.name} description={desiredState.description} variant='h6' />
                            </Paper>
                        );
                    })}
                </Stack>
                <Divider color='#ccc' sx={{ my: 1 }} />
                {actions && <ActionTrackButtons actions={actions} />}
                <div style={{ paddingBottom: '50vh' }} />
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom='60px' />}
            </Box>
        </BasePage>
    );
};

export default Home;
