import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardContent, Chip, Grid, IconButton, Typography, Menu, MenuItem, ListItemIcon, ListItemText, Stack } from '@mui/material';
import { memo, useState } from 'react';
import type { ThinkingNote as ThinkingNoteType } from '../../../types/journal';
import ThinkingNoteDialog from './Dialogs/ThinkingNoteDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useThinkingNoteContext from '../../../hooks/useThinkingNoteContext';
import useTagContext from '../../../hooks/useTagContext';
import AbsoluteEditButton from '../../../components/AbsoluteEditButton';
import DialogWithAppBar from '../../../components/DialogWithAppBar';

interface ThinkingNoteProps {
    thinkingNote: ThinkingNoteType;
}
type DialogType = 'View';

const ThinkingNote = ({ thinkingNote }: ThinkingNoteProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { getTagColor } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'View':
                return <ThinkingNoteViewDialog onClose={() => setOpenedDialog(undefined)} thinkingNote={thinkingNote} />;
        }
    };

    return (
        <Grid size={12} sx={{ textAlign: 'left' }}>
            <Card onClick={() => setOpenedDialog('View')}>
                <CardContent>
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

const ThinkingNoteViewDialog = ({ thinkingNote, onClose }: { thinkingNote: ThinkingNoteType; onClose: () => void }) => {
    const [openedDialog, setOpenedDialog] = useState<ViewDialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [showEditButton, setShowEditButton] = useState(false);

    const { deleteThinkingNote } = useThinkingNoteContext();
    const { getTagColor } = useTagContext();

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
                                setOpenedDialog('Delete');
                            }}
                        >
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText>削除</ListItemText>
                        </MenuItem>
                    </Menu>
                </>
            }
            content={
                <>
                    <Typography>{thinkingNote.question}</Typography>
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
