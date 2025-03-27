import styled from '@emotion/styled';
import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import BasePage from '../../components/BasePage';
import ActionTrack from './ActionTrack';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActiveActionTrack from './ActiveActionTrack';
import useActionContext from '../../hooks/useActionContext';
import ActionTrackButtons from './ActionTrackButtons';
import ActiveActionTracks from './ActiveActionTracks';

const ActionTracks = () => {
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
        <BasePage isLoading={isLoading} pageName='ActionTracks'>
            <Box sx={{ pt: 4 }}>
                {actions && <ActionTrackButtons actions={actions} />}
                <div style={{ paddingBottom: '50vh' }}>
                    {actionTracksByDate?.map(actionTracks => {
                        const filteredActionTracks = actionTracks.filter(actionTrack => actionTrack.endedAt !== undefined);
                        if (filteredActionTracks.length > 0) {
                            return (
                                <StyledBox key={`date-${filteredActionTracks[0].date}`}>
                                    <Typography>{filteredActionTracks[0].date}</Typography>
                                    <Grid container spacing={1}>
                                        {filteredActionTracks.map(actionTrack => (
                                            <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />
                                        ))}
                                    </Grid>
                                </StyledBox>
                            );
                        }
                        return <div key={actionTracks[0].date} />;
                    })}
                </div>
                {activeActionTracks && <ActiveActionTracks activeActionTracks={activeActionTracks} bottom='112px' />}
            </Box>
        </BasePage>
    );
};

const StyledBox = styled(Box)`
    text-align: left;
    padding-bottom: 8px;
`;

export default ActionTracks;
