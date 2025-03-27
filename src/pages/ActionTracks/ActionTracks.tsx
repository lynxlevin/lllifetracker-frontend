import styled from '@emotion/styled';
import { Box, Grid2 as Grid, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import BasePage from '../../components/BasePage';
import ActionTrack from './ActionTrack';
import useActionTrackContext from '../../hooks/useActionTrackContext';
import ActiveActionTrack from './ActiveActionTrack';
import ActionTrackButtons from './ActionTrackButtons';

const ActionTracks = () => {
    const { isLoading, getActionTracks, actionTracksByDate, activeActionTracks, dailyAggregation } = useActionTrackContext();

    useEffect(() => {
        if ([actionTracksByDate, activeActionTracks, dailyAggregation].some(x => x === undefined) && !isLoading) getActionTracks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionTracksByDate, activeActionTracks, getActionTracks]);
    return (
        <BasePage isLoading={isLoading} pageName='ActionTracks'>
            <Box sx={{ pt: 4 }}>
                <ActionTrackButtons />
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
                {activeActionTracks && (
                    <Stack
                        sx={{
                            position: 'fixed',
                            bottom: '112px',
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
