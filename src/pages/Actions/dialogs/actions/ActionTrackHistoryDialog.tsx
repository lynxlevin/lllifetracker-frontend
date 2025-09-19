import { Typography, Grid, Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ActionTrackDailyList } from '../../../../types/action_track';
import styled from '@emotion/styled';
import ActionTrack from '../../components/ActionTrack';
import { ActionTrackAPI } from '../../../../apis/ActionTrackAPI';
import { format } from 'date-fns';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface ActionTrackHistoryDialogProps {
    onClose: () => void;
}

const ActionTrackHistoryDialog = ({ onClose }: ActionTrackHistoryDialogProps) => {
    const [actionTracksGroupedByCalendar, setActionTracksGroupedByCalendar] = useState<ActionTrackDailyList>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        ActionTrackAPI.list().then(res => {
            const result: ActionTrackDailyList = {};
            let lastYearMonth = '';
            let lastDate = 0;
            for (const track of res.data) {
                const startedAt = new Date(track.started_at);
                const yearMonth: keyof ActionTrackDailyList = format(startedAt, 'yyyyMM');
                const date = startedAt.getDate();
                if (lastYearMonth !== yearMonth) {
                    lastYearMonth = yearMonth;
                    lastDate = date;
                    Object.defineProperty(result, yearMonth, { value: [{ date, actionTracks: [track] }], enumerable: true });
                } else if (lastDate !== date) {
                    lastDate = date;
                    result[yearMonth].push({ date, actionTracks: [track] });
                } else {
                    result[yearMonth][result[yearMonth].length - 1].actionTracks.push(track);
                }
            }
            setActionTracksGroupedByCalendar(result);
            setIsLoading(false);
        });
    }, []);
    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h5">活動履歴</Typography>}
            content={
                actionTracksGroupedByCalendar === undefined || isLoading ? (
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
                        {Object.keys(actionTracksGroupedByCalendar)
                            .sort()
                            .reverse()
                            .map(yearMonth => {
                                return (
                                    <StyledBox key={`year_month_${yearMonth}`}>
                                        <Typography>{yearMonth}</Typography>
                                        {actionTracksGroupedByCalendar[yearMonth].map(item => {
                                            return (
                                                <StyledBox key={`date_${item.date}`}>
                                                    <Typography>{item.date}日</Typography>
                                                    <Grid container spacing={1}>
                                                        {item.actionTracks.map(actionTrack => (
                                                            <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />
                                                        ))}
                                                    </Grid>
                                                </StyledBox>
                                            );
                                        })}
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
