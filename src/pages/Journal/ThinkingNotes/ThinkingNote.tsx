import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import ArchiveIcon from '@mui/icons-material/Archive';
import { Card, CardContent, Chip, Grid, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { memo, useState } from 'react';
import type { ThinkingNote as ThinkingNoteType } from '../../../types/journal';
import ThinkingNoteDialog from './Dialogs/ThinkingNoteDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useThinkingNoteContext, { ThinkingNoteStatus } from '../../../hooks/useThinkingNoteContext';
import useTagContext from '../../../hooks/useTagContext';
import AbsoluteEditButton from '../../../components/AbsoluteEditButton';
import DialogWithAppBar from '../../../components/DialogWithAppBar';
import { green } from '@mui/material/colors';

interface ThinkingNoteProps {
    thinkingNote: ThinkingNoteType;
}
type DialogType = 'View';

const ThinkingNote = ({ thinkingNote }: ThinkingNoteProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { getTagColor } = useTagContext();

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
                    <Typography fontSize="1.15rem" mb={1}>
                        {thinkingNote.question}
                    </Typography>
                    {thinkingNote.tags.length > 0 && (
                        <Stack direction="row" mb={1} flexWrap="wrap" gap={0.5}>
                            {thinkingNote.tags.map(tag => (
                                <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                            ))}
                        </Stack>
                    )}
                    <div className="line-clamp">{thinkingNote.thought}</div>
                </CardContent>
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

type ViewDialogType = 'Edit' | 'Delete';

const ThinkingNoteViewDialog = ({ thinkingNote, onClose, status }: { thinkingNote: ThinkingNoteType; onClose: () => void; status: ThinkingNoteStatus }) => {
    const [openedDialog, setOpenedDialog] = useState<ViewDialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [showEditButton, setShowEditButton] = useState(false);

    const { archiveThinkingNote, unarchiveThinkingNote, resolveThinkingNote, unResolveThinkingNote, deleteThinkingNote } = useThinkingNoteContext();
    const { getTagColor } = useTagContext();

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
    return (
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>{getAppBarTitle()}</Typography>}
            content={
                <>
                    <Stack direction="row">
                        <Typography>{thinkingNote.question}</Typography>
                        <div style={{ flexGrow: 1 }} />

                        <IconButton
                            size="small"
                            onClick={event => {
                                setMenuAnchor(event.currentTarget);
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                            {status === 'active' && (
                                <>
                                    {getMenuItem(<EditIcon />, '編集する', () => {
                                        setOpenedDialog('Edit');
                                    })}
                                    {getMenuItem(<CheckCircleIcon sx={{ color: green['A700'] }} />, '解決済みにする', () => {
                                        resolveThinkingNote(thinkingNote);
                                    })}
                                    {getMenuItem(<ArchiveIcon />, 'アーカイブする', () => {
                                        archiveThinkingNote(thinkingNote);
                                    })}
                                    {getMenuItem(<DeleteIcon />, '削除する', () => {
                                        setOpenedDialog('Delete');
                                    })}
                                </>
                            )}
                            {status === 'resolved' &&
                                getMenuItem(<UndoIcon />, '悩み中に戻す', () => {
                                    unResolveThinkingNote(thinkingNote);
                                })}
                            {status === 'archived' && (
                                <>
                                    {getMenuItem(<UndoIcon />, '悩み中に戻す', () => {
                                        unarchiveThinkingNote(thinkingNote);
                                    })}

                                    {getMenuItem(<DeleteIcon />, '削除する', () => {
                                        setOpenedDialog('Delete');
                                    })}
                                </>
                            )}
                        </Menu>
                    </Stack>
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
                            <AbsoluteEditButton onClick={() => setOpenedDialog('Edit')} size="large" bottom={10} right={20} visible={showEditButton} />
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
