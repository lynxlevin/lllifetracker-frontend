import { Button, IconButton, Grid, Stack, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Paper, Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import type { ActionTrackType, ActionWithGoal } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import InsightsIcon from '@mui/icons-material/Insights';
import BookIcon from '@mui/icons-material/Book';
import BuildIcon from '@mui/icons-material/Build';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import AbsoluteButton from '../../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import ActionGoalDialog from './ActionGoalDialog';
import useTagContext from '../../../../hooks/useTagContext';
import type { Journal as JournalType } from '../../../../types/journal';
import { JournalAPI } from '../../../../apis/JournalAPI';
import Journal from '../../../Journal/Journal';
import ActionCreateEditDialog from './ActionCreateEditDialog';

interface ActionDialogProps {
    onClose: () => void;
    action: ActionWithGoal;
}

type TabName = 'details' | 'journals' | 'settings';
type DialogType = 'Edit' | 'ConvertTrackType' | 'Archive' | 'Goal';

const ActionDialog = ({ onClose, action }: ActionDialogProps) => {
    const [selectedTab, setSelectedTab] = useState<TabName>('details');
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [journals, setJournals] = useState<JournalType[]>();

    const { archiveAction, convertActionTrackType } = useActionContext();
    const { tags, getTags, isLoading: isLoadingTags } = useTagContext();

    const getTrackTypeName = (trackType: ActionTrackType) => {
        switch (trackType) {
            case 'TimeSpan':
                return '時間';
            case 'Count':
                return '回数';
        }
    };

    const getGoalDisplay = () => {
        if (!action.goal) return 'なし';
        return action.track_type === 'TimeSpan' ? `${action.goal.duration_seconds / 60} 分` : `${action.goal.count} 回`;
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit': {
                return <ActionCreateEditDialog action={action} onClose={() => setOpenedDialog(undefined)} />;
            }
            case 'ConvertTrackType': {
                const trackType = action.track_type === 'Count' ? 'TimeSpan' : 'Count';
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            convertActionTrackType(action.id, trackType);
                            setOpenedDialog(undefined);
                            onClose();
                        }}
                        title="活動：計測方法変換"
                        message={`「${action.name}」の計測方法を「${getTrackTypeName(trackType)}」へ変換します。計測済みの履歴には影響はありません。`}
                        actionName="変換する"
                    />
                );
            }
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            archiveAction(action.id);
                            setOpenedDialog(undefined);
                        }}
                        title="活動：アーカイブ"
                        message={`「${action.name}」をアーカイブします。`}
                        actionName="アーカイブする"
                    />
                );
            case 'Goal':
                return <ActionGoalDialog action={action} onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    const getTabContent = () => {
        switch (selectedTab) {
            case 'details':
                return (
                    <>
                        <Paper sx={{ padding: 2 }}>
                            <Stack direction="row" alignItems="center" mb={1}>
                                <Typography variant="body1" style={{ color: action.color }}>
                                    ⚫︎
                                </Typography>
                                <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                    {action.name}
                                </Typography>
                            </Stack>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                {action.description}
                            </Typography>
                        </Paper>
                        <AbsoluteButton
                            onClick={() => {
                                setOpenedDialog('Edit');
                            }}
                            bottom={10}
                            right={20}
                            icon={<EditIcon fontSize="large" />}
                        />
                    </>
                );
            case 'journals':
                // {journals !== undefined && (
                return (
                    <Grid container spacing={1}>
                        {journals!.map(journal => {
                            const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
                            return <Journal key={journalId} journal={journal} />;
                        })}
                    </Grid>
                );
            case 'settings':
                return (
                    <Paper sx={{ padding: 2 }}>
                        <Stack direction="row" alignItems="center">
                            <Typography>計測方法：{getTrackTypeName(action.track_type)}</Typography>
                            <Button size="small" sx={{ marginLeft: 1 }} onClick={() => setOpenedDialog('ConvertTrackType')}>
                                {action.track_type === 'TimeSpan' ? (
                                    <>
                                        <ChangeCircleIcon />
                                        回数での計測に変更
                                    </>
                                ) : (
                                    <>
                                        <ChangeCircleIcon />
                                        時間での計測に変更
                                    </>
                                )}
                            </Button>
                        </Stack>
                        <Stack direction="row" alignItems="center" mt={1.5}>
                            <Typography>1日の目標：{getGoalDisplay()}</Typography>
                            <IconButton size="small" onClick={() => setOpenedDialog('Goal')} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Stack>
                    </Paper>
                );
        }
    };

    useEffect(() => {
        if (tags !== undefined || isLoadingTags) return;
        getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTags, tags]);
    useEffect(() => {
        if (journals !== undefined) return;
        const actionTagIds = tags?.filter(tag => tag.type === 'Action' && tag.name === action.name).map(tag => tag.id) ?? [];
        if (actionTagIds.length === 0) return;
        JournalAPI.list({ tag_id_or: actionTagIds }).then(res => {
            setJournals(res.data);
        });
    }, [action, journals, tags]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>{action.name}</Typography>}
            appBarMenu={
                <>
                    <IconButton
                        size="small"
                        onClick={event => {
                            setMenuAnchor(event.currentTarget);
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                        <>
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    setOpenedDialog('Edit');
                                }}
                            >
                                <ListItemIcon>
                                    <EditIcon />
                                </ListItemIcon>
                                <ListItemText>編集</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    setOpenedDialog('Archive');
                                }}
                            >
                                <ListItemIcon>
                                    <ArchiveIcon />
                                </ListItemIcon>
                                <ListItemText>アーカイブする</ListItemText>
                            </MenuItem>
                        </>
                    </Menu>
                </>
            }
            content={
                <>
                    <Tabs
                        value={selectedTab}
                        onChange={(_: React.SyntheticEvent, newValue: string) => setSelectedTab(newValue as TabName)}
                        centered
                        sx={{ marginBottom: '0.5rem' }}
                    >
                        <Tab
                            label={
                                <Stack direction="row" alignItems="center">
                                    <InsightsIcon />
                                    <Typography ml={1}>詳細</Typography>
                                </Stack>
                            }
                            value="details"
                        />
                        <Tab
                            label={
                                <Stack direction="row" alignItems="center">
                                    <BookIcon />
                                    <Typography ml={1}>日誌{`(${journals?.length ?? '-'})`}</Typography>
                                </Stack>
                            }
                            value="journals"
                        />
                        <Tab
                            label={
                                <Stack direction="row" alignItems="center">
                                    <BuildIcon />
                                    <Typography ml={1}>設定</Typography>
                                </Stack>
                            }
                            value="settings"
                        />
                    </Tabs>
                    {getTabContent()}
                    {openedDialog && getDialog()}
                </>
            }
            bgColor="grey"
        />
    );
};

export default ActionDialog;
