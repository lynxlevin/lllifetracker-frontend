import { Typography, Grid, Box, CircularProgress, Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ActionTrackDailyList } from '../../../../types/action_track';
import styled from '@emotion/styled';
import ActionTrack from '../../components/ActionTrack';
import { ActionTrackAPI } from '../../../../apis/ActionTrackAPI';
import { endOfMonth, format, parse, subMonths } from 'date-fns';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import useUserContext from '../../../../hooks/useUserContext';

interface ActionTrackHistoryDialogProps {
    onClose: () => void;
}

const ActionTrackHistoryDialog = ({ onClose }: ActionTrackHistoryDialogProps) => {
    const [actionTracksGroupedByCalendar, setActionTracksGroupedByCalendar] = useState<ActionTrackDailyList>();
    const [selectedYearMonth, setSelectedYearMonth] = useState(format(new Date(), 'yyyyMM'));
    const { user, getUser } = useUserContext();

    const getTabYearMonths = () => {
        if (!user?.first_track_at) return [];
        const today = new Date();
        const startDay = new Date(user.first_track_at);
        const yearMonths = [format(today, 'yyyyMM')];
        while (yearMonths[yearMonths.length - 1] !== format(startDay, 'yyyyMM')) {
            const lastMonth = subMonths(parse(yearMonths[yearMonths.length - 1], 'yyyyMM', new Date()), 1);
            yearMonths.push(format(lastMonth, 'yyyyMM'));
        }
        return yearMonths;
    };

    useEffect(() => {
        if (user !== undefined) return;
        getUser();
    }, [getUser, user]);

    useEffect(() => {
        if (actionTracksGroupedByCalendar !== undefined && Object.keys(actionTracksGroupedByCalendar).includes(selectedYearMonth)) return;
        const monthStart = parse(selectedYearMonth, 'yyyyMM', new Date());
        const monthEnd = endOfMonth(monthStart);
        ActionTrackAPI.list({ startedAtGte: monthStart, startedAtLte: monthEnd }).then(res => {
            if (res.data.length === 0) {
                const empty = {};
                Object.defineProperty(empty, selectedYearMonth, { value: [], enumerable: true });
                setActionTracksGroupedByCalendar(prev => {
                    return { ...prev, ...empty };
                });
                return;
            }
            const result: ActionTrackDailyList = {};
            let lastDate = 0;
            Object.defineProperty(result, selectedYearMonth, { value: [], writable: true, enumerable: true });
            for (const track of res.data) {
                const date = new Date(track.started_at).getDate();
                if (lastDate !== date) {
                    lastDate = date;
                    result[selectedYearMonth].push({ date, actionTracks: [track] });
                } else {
                    result[selectedYearMonth][result[selectedYearMonth].length - 1].actionTracks.push(track);
                }
            }
            setActionTracksGroupedByCalendar(prev => {
                return { ...prev, ...result };
            });
        });
    }, [actionTracksGroupedByCalendar, selectedYearMonth]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography variant="h5">活動履歴</Typography>}
            content={
                <>
                    <Tabs
                        value={selectedYearMonth}
                        onChange={(_, newValue: string | null) => {
                            if (newValue !== null) setSelectedYearMonth(newValue);
                        }}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                    >
                        {getTabYearMonths().map(yearMonth => {
                            return <Tab key={yearMonth} value={yearMonth} label={yearMonth} />;
                        })}
                    </Tabs>
                    {actionTracksGroupedByCalendar === undefined || !Object.keys(actionTracksGroupedByCalendar).includes(selectedYearMonth) ? (
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
                            {actionTracksGroupedByCalendar[selectedYearMonth].map(item => {
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
                        </>
                    )}
                </>
            }
        />
    );
};

const StyledBox = styled(Box)`
    text-align: left;
    padding-bottom: 8px;
`;

export default ActionTrackHistoryDialog;
