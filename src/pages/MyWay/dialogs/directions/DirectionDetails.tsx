import { Grid, Typography, Paper, Tabs, Tab, Stack, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import InsightsIcon from '@mui/icons-material/Insights';
import BookIcon from '@mui/icons-material/Book';
import BuildIcon from '@mui/icons-material/Build';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import EjectIcon from '@mui/icons-material/Eject';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import AbsoluteButton from '../../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import useTagContext from '../../../../hooks/useTagContext';
import type { JournalSearchParams } from '../../../../types/journal';
import Journal from '../../../Journal/Journal';
import { Direction } from '../../../../types/my_way';
import useDirectionContext from '../../../../hooks/useDirectionContext';
import DirectionDialog from './DirectionDialog';
import JournalCreateDialog from '../../../Journal/Dialogs/JournalCreateDialog';
import { format } from 'date-fns';
import useJournalContext from '../../../../hooks/useJournalContext';

interface DirectionDetailsProps {
    onClose: () => void;
    direction: Direction;
}

type TabName = 'details' | 'journals' | 'settings';
type DialogType = 'Edit' | 'Archive' | 'Unarchive' | 'Delete' | 'DoubleCheckDelete' | 'CreateJournal';

const DirectionDetails = ({ onClose, direction }: DirectionDetailsProps) => {
    const [selectedTab, setSelectedTab] = useState<TabName>('details');
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { archiveDirection, unarchiveDirection, deleteDirection } = useDirectionContext();
    const { tags: tagsMaster, getTags, isLoading: isLoadingTags } = useTagContext();
    const { journals, setSearchParams, getJournals } = useJournalContext();

    const tags = useMemo(() => {
        if (tagsMaster === undefined) return [];
        return tagsMaster.filter(tag => tag.type === 'Direction' && tag.name === direction.name) ?? [];
    }, [direction.name, tagsMaster]);

    const closeDialog = () => {
        setOpenedDialog(undefined);
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit': {
                return <DirectionDialog direction={direction} onClose={closeDialog} />;
            }
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={closeDialog}
                        handleSubmit={() => {
                            archiveDirection(direction.id)
                                .then(_ => setOpenedDialog(undefined))
                                .catch(_ => {});
                        }}
                        title="指針：非表示にする"
                        message={`「${direction.name}」を非表示にします。`}
                        actionName="非表示にする"
                    />
                );
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={closeDialog}
                        handleSubmit={() => {
                            unarchiveDirection(direction.id)
                                .then(_ => setOpenedDialog(undefined))
                                .catch(_ => {});
                        }}
                        title="指針：見えるようにする"
                        message={`「${direction.name}」を見えるようにします。`}
                        actionName="見えるようにする"
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={closeDialog}
                        handleSubmit={() => {
                            setOpenedDialog('DoubleCheckDelete');
                        }}
                        title="指針：削除"
                        message={`⚠️「${direction!.name}」を完全に削除します。⚠️`}
                        actionName="削除する"
                        actionColor="error"
                    />
                );
            case 'DoubleCheckDelete':
                return (
                    <ConfirmationDialog
                        onClose={closeDialog}
                        handleSubmit={() => {
                            deleteDirection(direction!.id)
                                .then(_ => setOpenedDialog(undefined))
                                .catch(_ => {});
                        }}
                        title="指針：削除"
                        message={`⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️\n「${direction.name}」を完全に削除します。\n本当に削除するんですね？このボタンを押すと今度こそ削除します。\n⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️`}
                        actionName="本当に削除する"
                        actionColor="error"
                    />
                );
            case 'CreateJournal':
                return (
                    <JournalCreateDialog
                        onClose={() => {
                            closeDialog();
                        }}
                        defaultTags={[tags[0]]}
                    />
                );
        }
    };

    const getTabContent = () => {
        switch (selectedTab) {
            case 'details':
                return (
                    <>
                        <Paper sx={{ padding: 2, position: 'relative' }}>
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {direction.name}
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100, mt: 1 }}>
                                {direction.description}
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 100, textAlign: 'right', mt: 2 }}>
                                Since: {format(direction.created_at, 'yyyy/MM/dd')}
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
                        {tags.length > 0 && (
                            <AbsoluteButton
                                onClick={() => {
                                    setOpenedDialog('CreateJournal');
                                }}
                                bottom={10}
                                right={20}
                                icon={<AddIcon fontSize="large" />}
                            />
                        )}
                    </>
                );
            case 'settings':
                return (
                    <Paper sx={{ padding: 2 }}>
                        <Stack alignItems="start">
                            {direction.archived ? (
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
    }, [direction, tags]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterText={`${direction.name}${direction.archived ? '(非表示)' : ''}`}
            content={
                <>
                    <Tabs
                        value={selectedTab}
                        onChange={(_: React.SyntheticEvent, newValue: string) => setSelectedTab(newValue as TabName)}
                        centered
                        sx={{ marginBottom: '0.5rem' }}
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

export default DirectionDetails;
