import { Box } from '@mui/material';
import { useEffect } from 'react';
import BasePage from '../components/BasePage';
import useActionTrackContext from '../hooks/useActionTrackContext';
import ActionTrackButtons from './ActionTracks/ActionTrackButtons';
import useActionContext from '../hooks/useActionContext';
import ActiveActionTracks from './ActionTracks/ActiveActionTracks';

const Top = () => {
    const { isLoading: isLoadingActionTrack, getActionTracks, actionTracksByDate, activeActionTracks, dailyAggregation } = useActionTrackContext();
    const { isLoading: isLoadingActions, getActions, actions } = useActionContext();

    const isLoading = isLoadingActionTrack || isLoadingActions;

    useEffect(() => {
        if ([actionTracksByDate, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksByDate, activeActionTracks, getActionTracks]);

    useEffect(() => {
        if (actions === undefined && !isLoading) getActions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions, getActions]);
    return (
        <BasePage isLoading={isLoading} pageName='Top'>
            <Box sx={{ pt: 4 }}>
                {actions && <ActionTrackButtons actions={actions} />}
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom='60px' />}
            </Box>
        </BasePage>
    );
};

export default Top;
