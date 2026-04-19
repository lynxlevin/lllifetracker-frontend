import {
    Typography,
    Box,
    CircularProgress,
    Tabs,
    Tab,
    IconButton,
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Switch,
    FormControlLabel,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { ActionTrackDailyList } from '../../../../types/action_track';
import styled from '@emotion/styled';
import ActionTrack from '../../components/ActionTrack';
import { ActionTrackAPI } from '../../../../apis/ActionTrackAPI';
import { endOfMonth, format, parse, subMonths } from 'date-fns';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import useUserContext from '../../../../hooks/useUserContext';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import useActionContext from '../../../../hooks/useActionContext';

interface ActionTrackHistoryDialogProps {
    onClose: () => void;
}

const ActionTrackHistoryDialog = ({ onClose }: ActionTrackHistoryDialogProps) => {
    const [actionTracksGroupedByCalendar, setActionTracksGroupedByCalendar] = useState<ActionTrackDailyList>();
    const [selectedYearMonth, setSelectedYearMonth] = useState(format(new Date(), 'yyyyMM'));
    const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
    const [openedDialog, setOpenedDialog] = useState<'Filter'>();

    const { activeActions } = useActionContext();
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

    const getDialog = () => {
        switch (openedDialog) {
            case 'Filter':
                return (
                    <Dialog open onClose={onClose} fullWidth>
                        <DialogContent>
                            <Box>
                                {activeActions?.map(action => (
                                    <FormControlLabel
                                        key={action.id}
                                        label={action.name}
                                        control={
                                            <Switch
                                                checked={selectedActionIds.includes(action.id)}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                    if (event.target.checked) {
                                                        setSelectedActionIds(curr => [...curr, action.id]);
                                                    } else {
                                                        setSelectedActionIds(curr => {
                                                            const res = [...curr];
                                                            const index = res.indexOf(action.id);
                                                            if (index > -1) res.splice(index, 1);
                                                            return res;
                                                        });
                                                    }
                                                }}
                                            />
                                        }
                                    />
                                ))}
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'center' }}>
                            <Button variant="outlined" onClick={() => setOpenedDialog(undefined)} sx={{ color: 'primary.dark' }}>
                                閉じる
                            </Button>
                        </DialogActions>
                    </Dialog>
                );
        }
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
            appBarCenterText="活動履歴"
            appBarMenu={
                <>
                    <IconButton size="small" onClick={() => setOpenedDialog('Filter')}>
                        <FilterAltIcon />
                    </IconButton>
                </>
            }
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
                            {actionTracksGroupedByCalendar[selectedYearMonth]
                                .filter(
                                    group =>
                                        selectedActionIds.length === 0 ||
                                        group.actionTracks.find(actionTrack => selectedActionIds.includes(actionTrack.action_id)) !== undefined,
                                )
                                .map(item => {
                                    return (
                                        <StyledBox key={`date_${item.date}`}>
                                            <Typography>{item.date}日</Typography>
                                            {item.actionTracks
                                                .filter(actionTrack => selectedActionIds.length === 0 || selectedActionIds.includes(actionTrack.action_id))
                                                .map(actionTrack => (
                                                    <ActionTrack key={actionTrack.id} actionTrack={actionTrack} />
                                                ))}
                                        </StyledBox>
                                    );
                                })}
                        </>
                    )}
                    {openedDialog && getDialog()}
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
