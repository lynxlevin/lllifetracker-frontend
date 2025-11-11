import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import { Card, CardContent, Chip, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { useState } from 'react';
import type { ThinkingNote as ThinkingNoteType } from '../../../types/journal';
import ThinkingNoteDialog from './ThinkingNoteDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useThinkingNoteAPI, { ThinkingNoteStatus } from '../../../hooks/useThinkingNoteAPI';
import useTagContext from '../../../hooks/useTagContext';
import AbsoluteButton from '../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../components/DialogWithAppBar';
import { green } from '@mui/material/colors';

type ViewDialogType = 'Edit' | 'Delete';

export const ThinkingNoteViewDialog = ({
    thinkingNote,
    onClose,
    status,
}: {
    thinkingNote: ThinkingNoteType;
    onClose: () => void;
    status: ThinkingNoteStatus;
}) => {
    const [openedDialog, setOpenedDialog] = useState<ViewDialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const { resolveThinkingNote, unResolveThinkingNote, deleteThinkingNote } = useThinkingNoteAPI();
    const { getTagColor } = useTagContext();

    const getAppBarTitle = () => {
        switch (status) {
            case 'active':
                return '悩み中';
            case 'resolved':
                return '解決済み';
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setMenuAnchor(event.currentTarget);
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
                    <Stack direction="row" alignItems="center">
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
                                    })}
                                    {getMenuItem(<CheckCircleIcon sx={{ color: green['A700'] }} />, '解決済みにする', () => {
                                        resolveThinkingNote(thinkingNote);
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
                    <Card sx={{ textAlign: 'left' }}>
                        <CardContent>
                            <Typography fontSize="0.9rem" whiteSpace="pre-wrap" overflow="auto">
                                {thinkingNote.thought}
                            </Typography>
                            {status === 'active' && (
                                <AbsoluteButton
                                    onClick={() => {
                                        setOpenedDialog('Edit');
                                    }}
                                    bottom={10}
                                    right={20}
                                    icon={<EditIcon fontSize="large" />}
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
