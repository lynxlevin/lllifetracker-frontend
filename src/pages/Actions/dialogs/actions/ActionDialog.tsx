import { Button, IconButton, Grid, Stack, Typography, Paper, Tabs, Tab, Divider } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import type { ActionTrackType, ActionWithGoal } from '../../../../types/my_way';
import useActionContext from '../../../../hooks/useActionContext';
import InsightsIcon from '@mui/icons-material/Insights';
import BookIcon from '@mui/icons-material/Book';
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import AbsoluteButton from '../../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import ActionGoalDialog from './ActionGoalDialog';
import useTagContext from '../../../../hooks/useTagContext';
import type { JournalSearchParams } from '../../../../types/journal';
import Journal from '../../../Journal/Journal';
import ActionCreateEditDialog from './ActionCreateEditDialog';
import JournalCreateDialog from '../../../Journal/Dialogs/JournalCreateDialog';
import { format } from 'date-fns';
import useJournalContext from '../../../../hooks/useJournalContext';

interface ActionDialogProps {
    onClose: () => void;
    action: ActionWithGoal;
}

type TabName = 'details' | 'journals' | 'settings';
type DialogType = 'Edit' | 'ConvertTrackType' | 'Archive' | 'Unarchive' | 'Delete' | 'DoubleCheckDelete' | 'Goal' | 'CreateJournal';

const ActionDialog = ({ onClose, action }: ActionDialogProps) => {
    const [selectedTab, setSelectedTab] = useState<TabName>('details');
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { archiveAction, unarchiveAction, deleteAction, convertActionTrackType } = useActionContext();
    const { tags: tagsMaster, getTags, isLoading: isLoadingTags } = useTagContext();
    const { journals, setSearchParams, getJournals } = useJournalContext();

    const tags = useMemo(() => {
        if (tagsMaster === undefined) return [];
        return tagsMaster.filter(tag => tag.type === 'Action' && tag.name === action.name) ?? [];
    }, [action.name, tagsMaster]);

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

    const closeDialog = () => {
        setOpenedDialog(undefined);
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit': {
                return <ActionCreateEditDialog action={action} onClose={closeDialog} />;
            }
            case 'ConvertTrackType': {
                const trackType = action.track_type === 'Count' ? 'TimeSpan' : 'Count';
                return (
                    <ConfirmationDialog
                        onClose={closeDialog}
                        handleSubmit={() => {
                            convertActionTrackType(action.id, trackType)
                                .then(_ => {
                                    setOpenedDialog(undefined);
                                    onClose();
                                })
                                .catch(_ => {});
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
                        onClose={closeDialog}
                        handleSubmit={() => {
                            archiveAction(action.id)
                                .then(_ => {
                                    setOpenedDialog(undefined);
                                })
                                .catch(_ => {});
                        }}
                        title="活動：非表示にする"
                        message={`「${action.name}」を非表示にします。`}
                        actionName="非表示にする"
                    />
                );
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={closeDialog}
                        handleSubmit={() => {
                            unarchiveAction(action.id)
                                .then(_ => {
                                    setOpenedDialog(undefined);
                                })
                                .catch(_ => {});
                        }}
                        title="活動：見えるようにする"
                        message={`「${action.name}」を見えるようにします。`}
                        actionName="見えるようにする"
                    />
                );
            case 'Goal':
                return <ActionGoalDialog action={action} onClose={closeDialog} />;
            case 'CreateJournal':
                return (
                    <JournalCreateDialog
                        onClose={() => {
                            closeDialog();
                        }}
                        defaultTags={[tags[0]]}
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            setOpenedDialog('DoubleCheckDelete');
                        }}
                        title="活動：削除"
                        message={`⚠️「${action.name}」を完全に削除します。⚠️`}
                        actionName="削除する"
                        actionColor="error"
                    />
                );
            case 'DoubleCheckDelete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            deleteAction(action.id)
                                .then(_ => {
                                    setOpenedDialog(undefined);
                                })
                                .catch(_ => {});
                        }}
                        title="活動：削除"
                        message={`⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n「${action.name}」を完全に削除します。\n本当に削除するんですね？このボタンを押すと今度こそ削除します。\n⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️`}
                        actionName="本当に削除する"
                        actionColor="error"
                    />
                );
        }
    };

    const getTabContent = () => {
        switch (selectedTab) {
            case 'details':
                return (
                    <>
                        <Paper sx={{ padding: 2 }}>
                            <Typography variant="body2" fontWeight={100} mb={1}>
                                心構え
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {action.discipline}
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="body2" fontWeight={100} mb={1}>
                                メモ
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                {action.memo}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 100, textAlign: 'right', mt: 2 }}>
                                Since: {format(action.created_at, 'yyyy/MM/dd')}
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
                if (journals === undefined) return <></>;
                return (
                    <>
                        <Grid container spacing={1}>
                            {journals.map(journal => {
                                const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
                                return <Journal key={journalId} journal={journal} />;
                            })}
                        </Grid>
                        <AbsoluteButton
                            onClick={() => {
                                setOpenedDialog('CreateJournal');
                            }}
                            bottom={10}
                            right={20}
                            icon={<AddIcon fontSize="large" />}
                        />
                    </>
                );
            case 'settings':
                return (
                    <Paper sx={{ padding: 2 }}>
                        <Stack alignItems="start">
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
                            {action.archived ? (
                                <Button size="small" onClick={() => setOpenedDialog('Unarchive')} sx={{ mt: 1.5 }}>
                                    <EjectIcon />
                                    見えるようにする
                                </Button>
                            ) : (
                                <Button size="small" onClick={() => setOpenedDialog('Archive')} sx={{ mt: 1.5 }}>
                                    <InventoryIcon />
                                    非表示にする
                                </Button>
                            )}
                            <Button size="small" color="error" onClick={() => setOpenedDialog('Delete')} sx={{ mt: 3.5 }}>
                                <DeleteIcon />
                                削除する
                            </Button>
                        </Stack>
                    </Paper>
                );
        }
    };

    useEffect(() => {
        if (tagsMaster !== undefined || isLoadingTags) return;
        getTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTags, tagsMaster]);
    useEffect(() => {
        if (tags.length === 0) return;
        const params: JournalSearchParams = { text: undefined, tags, status: 'MyWay' };
        setSearchParams(params);
        getJournals(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, tagsMaster]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterText="活動詳細"
            content={
                <>
                    <Stack direction="row" pt={0.5}>
                        <Typography variant="h6" style={{ color: action.color }}>
                            ⚫︎
                        </Typography>
                        <Typography variant="h6" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                            {action.name}
                            {action.archived ? '(非表示)' : ''}
                        </Typography>
                    </Stack>
                    <Tabs
                        value={selectedTab}
                        onChange={(_: React.SyntheticEvent, newValue: string) => setSelectedTab(newValue as TabName)}
                        centered
                        sx={{ marginBottom: '0.5rem', marginTop: '-0.5rem' }}
                    >
                        <Tab iconPosition="start" icon={<InsightsIcon />} label="詳細" value="details" />
                        <Tab iconPosition="start" icon={<BookIcon />} label={`日誌(${journals?.length ?? '-'})`} value="journals" />
                        <Tab iconPosition="start" icon={<BuildIcon />} label="設定" value="settings" />
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
