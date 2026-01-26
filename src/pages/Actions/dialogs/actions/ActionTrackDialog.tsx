import { Box, Button, Dialog, DialogActions, DialogContent, Divider, Stack, Typography } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { useCallback, useEffect, useState } from 'react';
import type { ActionTrack } from '../../../../types/action_track';
import useActionTrackContext from '../../../../hooks/useActionTrackContext';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import useActionContext from '../../../../hooks/useActionContext';

interface ActionTrackDialogProps {
    onClose: () => void;
    actionTrack: ActionTrack;
}

const ActionTrackDialog = ({ onClose, actionTrack }: ActionTrackDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [startedAt, setStartedAt] = useState(new Date(actionTrack.started_at));
    const [endedAt, setEndedAt] = useState(actionTrack.ended_at !== null ? new Date(actionTrack.ended_at) : null);
    const [displayTime, setDisplayTime] = useState('');

    const { updateActionTrack, deleteActionTrack } = useActionTrackContext();
    const { actions } = useActionContext();
    const getDate = (date: Date | null) => {
        if (date === null) return '';
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    };

    const stripSeconds = (time: Date | null): Date | null => {
        if (time === null) return null;
        time.setSeconds(0);
        time.setMilliseconds(0);
        return time;
    };

    const zeroPad = (num: number) => {
        return num.toString().padStart(2, '0');
    };

    const countTime = useCallback((startedAt: Date | null, endedAt: Date | null) => {
        if (startedAt === null) return '';
        const end = endedAt ?? new Date();
        const duration = (end.getTime() - startedAt.getTime()) / 1000;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor((duration % 3600) % 60);
        return `${hours}:${zeroPad(minutes)}:${zeroPad(seconds)}`;
    }, []);

    const action = actions?.find(item => item.id === actionTrack.action_id);

    useEffect(() => {
        const interval = setInterval(() => setDisplayTime(countTime(startedAt, endedAt)), 250);
        return () => clearInterval(interval);
    }, [countTime, endedAt, startedAt]);

    const handleSubmit = () => {
        updateActionTrack(actionTrack.id, startedAt!, endedAt, actionTrack.action_id);
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 4 }}>
                {action?.track_type === 'TimeSpan' ? (
                    <>
                        <Typography variant="h4" mb={1}>
                            {displayTime}
                        </Typography>
                        <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
                            <Box>
                                <Typography variant="body1" mb={1}>
                                    {getDate(startedAt)}
                                </Typography>
                                <MobileDateTimePicker
                                    ampm={false}
                                    openTo="minutes"
                                    format="HH:mm:ss"
                                    label="Started At"
                                    value={startedAt}
                                    onChange={newValue => setStartedAt(stripSeconds(newValue)!)}
                                    timeSteps={{ minutes: 1 }}
                                    sx={{ width: '140px' }}
                                />
                                <Stack direction="row">
                                    <Button
                                        size="small"
                                        onClick={() => setStartedAt(new Date())}
                                        sx={{ verticalAlign: 'bottom', ml: 'auto', display: 'block' }}
                                    >
                                        Now
                                    </Button>
                                </Stack>
                            </Box>
                            <Box>
                                {getDate(startedAt) !== getDate(endedAt) && (
                                    <Typography variant="body1" mb={1}>
                                        {getDate(endedAt)}
                                    </Typography>
                                )}
                                <MobileDateTimePicker
                                    ampm={false}
                                    openTo="minutes"
                                    format="HH:mm:ss"
                                    label="Ended At"
                                    value={endedAt}
                                    onChange={newValue => setEndedAt(stripSeconds(newValue))}
                                    timeSteps={{ minutes: 1 }}
                                    sx={{ width: '140px' }}
                                />
                                <Stack direction="row">
                                    <Button
                                        size="small"
                                        onClick={() => setEndedAt(null)}
                                        sx={{ verticalAlign: 'bottom', ml: 'auto', display: 'block' }}
                                        disabled={endedAt === null}
                                    >
                                        Clear
                                    </Button>
                                    <Button size="small" onClick={() => setEndedAt(new Date())} sx={{ verticalAlign: 'bottom', ml: 'auto', display: 'block' }}>
                                        Now
                                    </Button>
                                </Stack>
                            </Box>
                        </Stack>
                    </>
                ) : (
                    <Stack direction="row" alignItems="flex-end">
                        <Box>
                            <Typography variant="body1" mb={1}>
                                {getDate(startedAt)}
                            </Typography>
                            <MobileDateTimePicker
                                ampm={false}
                                openTo="minutes"
                                format="HH:mm:ss"
                                value={startedAt}
                                onChange={newValue => {
                                    setStartedAt(stripSeconds(newValue)!);
                                    setEndedAt(stripSeconds(newValue)!);
                                }}
                                timeSteps={{ minutes: 1 }}
                            />
                        </Box>
                        <Button
                            size="small"
                            onClick={() => {
                                const now = new Date();
                                setStartedAt(now);
                                setEndedAt(now);
                            }}
                            sx={{ verticalAlign: 'bottom' }}
                        >
                            Now
                        </Button>
                    </Stack>
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" fontWeight={600} mb={2}>
                    <span style={action?.color ? { color: action?.color } : {}}>⚫︎</span>
                    {action?.name}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                    {action?.description}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
                <Button variant="outlined" onClick={() => setIsDialogOpen(true)} color="error">
                    削除
                </Button>
                <Button variant="outlined" onClick={onClose} sx={{ color: 'primary.dark' }}>
                    キャンセル
                </Button>
                <Button variant="contained" onClick={handleSubmit} disabled={endedAt !== null && startedAt! > endedAt}>
                    保存
                </Button>
            </DialogActions>
            {isDialogOpen && (
                <ConfirmationDialog
                    onClose={() => {
                        setIsDialogOpen(false);
                    }}
                    handleSubmit={() => {
                        deleteActionTrack(actionTrack.id);
                        setIsDialogOpen(false);
                        onClose();
                    }}
                    title="計測履歴の削除"
                    message={`${action?.name}の計測履歴を削除します。一度削除すると元に戻せません。`}
                    actionName="削除"
                    actionColor="error"
                />
            )}
        </Dialog>
    );
};

export default ActionTrackDialog;
