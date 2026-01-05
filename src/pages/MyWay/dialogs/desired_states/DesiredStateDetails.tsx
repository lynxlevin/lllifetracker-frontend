import { IconButton, Grid, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Paper, Tabs, Tab } from '@mui/material';
import { useEffect, useState } from 'react';
import InsightsIcon from '@mui/icons-material/Insights';
import BookIcon from '@mui/icons-material/Book';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import StarsIcon from '@mui/icons-material/Stars';
import DeleteIcon from '@mui/icons-material/Delete';
import InventoryIcon from '@mui/icons-material/Inventory';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import AbsoluteButton from '../../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';
import useTagContext from '../../../../hooks/useTagContext';
import type { Journal as JournalType } from '../../../../types/journal';
import { JournalAPI } from '../../../../apis/JournalAPI';
import Journal from '../../../Journal/Journal';
import { DesiredState } from '../../../../types/my_way';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import DesiredStateDialog from './DesiredStateDialog';
import { yellow } from '@mui/material/colors';

interface DesiredStateDetailsProps {
    onClose: () => void;
    desiredState: DesiredState;
}

type TabName = 'details' | 'journals';
type DialogType = 'Edit' | 'Archive' | 'Delete';

const DesiredStateDetails = ({ onClose, desiredState }: DesiredStateDetailsProps) => {
    const [selectedTab, setSelectedTab] = useState<TabName>('details');
    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [journals, setJournals] = useState<JournalType[]>();

    const { archiveDesiredState, updateDesiredState, deleteDesiredState } = useDesiredStateContext();
    const { tags, getTags, isLoading: isLoadingTags } = useTagContext();

    const turnOnIsFocused = () => {
        updateDesiredState(desiredState.id, desiredState.name, desiredState.description, desiredState.category_id, true);
    };

    const turnOffIsFocused = () => {
        updateDesiredState(desiredState.id, desiredState.name, desiredState.description, desiredState.category_id, false);
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit': {
                return (
                    <DesiredStateDialog
                        desiredState={desiredState}
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            }
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveDesiredState(desiredState.id);
                            setOpenedDialog(undefined);
                        }}
                        title="大事にすること：しまっておく"
                        message={`「${desiredState.name}」をしまっておきます。`}
                        actionName="しまっておく"
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            deleteDesiredState(desiredState!.id);
                            setOpenedDialog(undefined);
                        }}
                        title="大事にすること：削除"
                        message={`「${desiredState!.name}」を完全に削除します。`}
                        actionName="削除する"
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
                            {desiredState.is_focused && <StarsIcon sx={{ position: 'absolute', top: 0, left: 0, fontSize: '1.2rem', color: yellow[700] }} />}
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {desiredState.name}
                            </Typography>
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                {desiredState.description}
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
                    <Grid container spacing={1}>
                        {journals!.map(journal => {
                            const journalId = journal.diary?.id ?? journal.reading_note?.id ?? journal.thinking_note?.id;
                            return <Journal key={journalId} journal={journal} />;
                        })}
                    </Grid>
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
        const tagIds = tags?.filter(tag => tag.type === 'DesiredState' && tag.name === desiredState.name).map(tag => tag.id) ?? [];
        if (tagIds.length === 0) return;
        JournalAPI.list({ tag_id_or: tagIds }).then(res => {
            setJournals(res.data);
        });
    }, [desiredState, journals, tags]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>{desiredState.name}</Typography>}
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
                            {desiredState.is_focused ? (
                                <MenuItem
                                    onClick={() => {
                                        setMenuAnchor(null);
                                        turnOffIsFocused();
                                    }}
                                >
                                    <ListItemIcon>
                                        <StarsIcon />
                                    </ListItemIcon>
                                    <ListItemText>フォーカスしない</ListItemText>
                                </MenuItem>
                            ) : (
                                <MenuItem
                                    onClick={() => {
                                        setMenuAnchor(null);
                                        turnOnIsFocused();
                                    }}
                                >
                                    <ListItemIcon>
                                        <StarsIcon sx={{ color: yellow[700] }} />
                                    </ListItemIcon>
                                    <ListItemText>フォーカスする</ListItemText>
                                </MenuItem>
                            )}
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    setOpenedDialog('Archive');
                                }}
                            >
                                <ListItemIcon>
                                    <InventoryIcon />
                                </ListItemIcon>
                                <ListItemText>しまっておく</ListItemText>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setMenuAnchor(null);
                                    setOpenedDialog('Delete');
                                }}
                            >
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <ListItemText>削除</ListItemText>
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
                        <Tab iconPosition="start" icon={<InsightsIcon />} label="詳細" value="details" />
                        <Tab iconPosition="start" icon={<BookIcon />} label={`日誌(${journals?.length ?? '-'})`} value="journals" />
                    </Tabs>
                    {getTabContent()}
                    {openedDialog && getDialog()}
                </>
            }
            bgColor="grey"
        />
    );
};

export default DesiredStateDetails;
