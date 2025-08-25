import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ArchiveIcon from '@mui/icons-material/Archive';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Card, CardContent, Chip, Grid, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import type { ThinkingNote as ThinkingNoteType } from '../../../types/journal';
import ThinkingNoteDialog from './Dialogs/ThinkingNoteDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useThinkingNoteContext, { ThinkingNoteStatus } from '../../../hooks/useThinkingNoteContext';
import useTagContext from '../../../hooks/useTagContext';
import AbsoluteEditButton from '../../../components/AbsoluteEditButton';
import DialogWithAppBar from '../../../components/DialogWithAppBar';
import { green } from '@mui/material/colors';
import { format } from 'date-fns';
import useLocalStorage from '../../../hooks/useLocalStorage';

interface ThinkingNoteProps {
    thinkingNote: ThinkingNoteType;
}
type DialogType = 'View';

const ThinkingNote = ({ thinkingNote }: ThinkingNoteProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { getTagColor } = useTagContext();
    const { getItemIdsToHide } = useLocalStorage();

    const status = thinkingNote.resolved_at === null ? (thinkingNote.archived_at === null ? 'active' : 'archived') : 'resolved';

    const getDialog = () => {
        switch (openedDialog) {
            case 'View':
                return <ThinkingNoteViewDialog onClose={() => setOpenedDialog(undefined)} thinkingNote={thinkingNote} status={status} />;
        }
    };

    return (
        <Grid size={12} sx={{ textAlign: 'left' }}>
            <Card onClick={() => setOpenedDialog('View')}>
                <CardContent sx={{ position: 'relative' }}>
                    {status === 'resolved' && <CheckCircleIcon sx={{ position: 'absolute', top: 2, left: 2, color: green['A700'], fontSize: '1.25rem' }} />}
                    {getItemIdsToHide().includes(thinkingNote.id) && (
                        <VisibilityOffIcon sx={{ position: 'absolute', top: 2, right: 2, opacity: 0.3, fontSize: '1.25rem' }} />
                    )}
                    <Typography fontSize="1.15rem">{thinkingNote.question}</Typography>
                    {thinkingNote.answer && (
                        <Typography fontSize="1.15rem" ml={3}>
                            →{thinkingNote.answer}
                        </Typography>
                    )}
                    {thinkingNote.tags.length > 0 && (
                        <Stack direction="row" my={1} flexWrap="wrap" gap={0.5}>
                            {thinkingNote.tags.map(tag => (
                                <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                            ))}
                        </Stack>
                    )}
                    <div className="line-clamp">{thinkingNote.thought}</div>
                </CardContent>
                {['resolved', 'archived'].includes(status) && (
                    <Typography textAlign="right" fontSize="0.7rem" mr={1} mb={1}>
                        {status === 'resolved' && `解決：${format(new Date(thinkingNote.resolved_at!), 'yyyy年MM月dd日')}`}
                        {status === 'archived' && `アーカイブ：${format(new Date(thinkingNote.archived_at!), 'yyyy年MM月dd日')}`}
                    </Typography>
                )}
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

type ViewDialogType = 'Edit' | 'Delete';

const ThinkingNoteViewDialog = ({ thinkingNote, onClose, status }: { thinkingNote: ThinkingNoteType; onClose: () => void; status: ThinkingNoteStatus }) => {
    const [openedDialog, setOpenedDialog] = useState<ViewDialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [menuOpenCount, setMenuOpenCount] = useState(0);
    const [showEditButton, setShowEditButton] = useState(false);
    const [hideIds, setHideIds] = useState<string[]>();

    const { archiveThinkingNote, unarchiveThinkingNote, resolveThinkingNote, unResolveThinkingNote, deleteThinkingNote } = useThinkingNoteContext();
    const { getTagColor } = useTagContext();
    const { getItemIdsToHide, setItemIdsToHide } = useLocalStorage();

    const getAppBarTitle = () => {
        switch (status) {
            case 'active':
                return '悩み中';
            case 'resolved':
                return '解決済み';
            case 'archived':
                return 'アーカイブ';
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (menuOpenCount === 10) {
            if (hideIds === undefined) return;
            if (hideIds.includes(thinkingNote.id)) {
                const idx = hideIds.indexOf(thinkingNote.id);
                const result = [...hideIds.slice(0, idx), ...hideIds.slice(idx + 1, hideIds.length)];
                setItemIdsToHide(result);
                setHideIds(result);
            } else {
                setItemIdsToHide([...hideIds, thinkingNote.id]);
                setHideIds([...hideIds, thinkingNote.id]);
            }
            return;
        }
        setMenuAnchor(event.currentTarget);
        setMenuOpenCount(prev => prev + 1);
    };

    const getMenuItem = (icon: JSX.Element, text: string, action: () => void) => {
        return (
            <MenuItem
                onClick={() => {
                    setMenuAnchor(null);
                    action();
                }}
            >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{text}</ListItemText>
            </MenuItem>
        );
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ThinkingNoteDialog onClose={() => setOpenedDialog(undefined)} thinkingNote={thinkingNote} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteThinkingNote(thinkingNote);
                            setOpenedDialog(undefined);
                        }}
                        title="Delete ThinkingNote"
                        message="This ThinkingNote will be permanently deleted. (Linked Tags will not be deleted)."
                        actionName="Delete"
                    />
                );
        }
    };

    useEffect(() => {
        if (hideIds !== undefined) return;
        setHideIds(getItemIdsToHide() ?? []);
    }, [getItemIdsToHide, hideIds]);
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>{getAppBarTitle()}</Typography>}
            content={
                <>
                    <Stack direction="row" alignItems="center">
                        {getItemIdsToHide().includes(thinkingNote.id) && <VisibilityOffIcon sx={{ opacity: 0.3, marginRight: 0.5 }} />}
                        <Typography fontSize="1.15rem">{thinkingNote.question}</Typography>
                        <div style={{ flexGrow: 1 }} />
                        <IconButton size="small" onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                            {status === 'active' && (
                                <>
                                    {getMenuItem(<EditIcon />, '編集する', () => {
                                        setOpenedDialog('Edit');
                                        setMenuOpenCount(0);
                                    })}
                                    {getMenuItem(<CheckCircleIcon sx={{ color: green['A700'] }} />, '解決済みにする', () => {
                                        resolveThinkingNote(thinkingNote);
                                        setMenuOpenCount(0);
                                    })}
                                    {getMenuItem(<ArchiveIcon />, 'アーカイブする', () => {
                                        archiveThinkingNote(thinkingNote);
                                        setMenuOpenCount(0);
                                    })}
                                    {getMenuItem(<DeleteIcon />, '削除する', () => {
                                        setOpenedDialog('Delete');
                                        setMenuOpenCount(0);
                                    })}
                                </>
                            )}
                            {status === 'resolved' &&
                                getMenuItem(<UndoIcon />, '悩み中に戻す', () => {
                                    unResolveThinkingNote(thinkingNote);
                                    setMenuOpenCount(0);
                                })}
                            {status === 'archived' && (
                                <>
                                    {getMenuItem(<UndoIcon />, '悩み中に戻す', () => {
                                        unarchiveThinkingNote(thinkingNote);
                                        setMenuOpenCount(0);
                                    })}

                                    {getMenuItem(<DeleteIcon />, '削除する', () => {
                                        setOpenedDialog('Delete');
                                        setMenuOpenCount(0);
                                    })}
                                </>
                            )}
                        </Menu>
                    </Stack>
                    {thinkingNote.answer && (
                        <Typography fontSize="1.15rem" ml={3}>
                            →{thinkingNote.answer}
                        </Typography>
                    )}
                    <Stack direction="row" mb={1} flexWrap="wrap" gap={0.5}>
                        {thinkingNote.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Stack>
                    <Card sx={{ textAlign: 'left' }} onClick={() => setShowEditButton(prev => !prev)}>
                        <CardContent>
                            <Typography fontSize="0.9rem" whiteSpace="pre-wrap" overflow="auto">
                                {thinkingNote.thought}
                            </Typography>
                            {status === 'active' && (
                                <AbsoluteEditButton
                                    onClick={() => {
                                        setOpenedDialog('Edit');
                                        setMenuOpenCount(0);
                                    }}
                                    size="large"
                                    bottom={10}
                                    right={20}
                                    visible={showEditButton}
                                />
                            )}
                        </CardContent>
                    </Card>
                    {openedDialog && getDialog()}
                </>
            }
            bgColor="grey"
        />
    );
};

export default memo(ThinkingNote);
