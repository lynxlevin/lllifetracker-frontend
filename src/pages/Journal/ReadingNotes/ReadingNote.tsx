import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    AppBar,
    Box,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogContent,
    Grid,
    IconButton,
    Typography,
    Toolbar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import type { ReadingNote as ReadingNoteType } from '../../../types/reading_note';
import ReadingNoteDialog from './Dialogs/ReadingNoteDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useReadingNoteContext from '../../../hooks/useReadingNoteContext';
import useTagContext from '../../../hooks/useTagContext';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AbsoluteEditButton from '../../../components/AbsoluteEditButton';

interface ReadingNoteProps {
    readingNote: ReadingNoteType;
}
type DialogType = 'View';

const ReadingNote = ({ readingNote }: ReadingNoteProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { getTagColor } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'View':
                return <ReadingNoteViewDialog onClose={() => setOpenedDialog(undefined)} readingNote={readingNote} />;
        }
    };

    return (
        <Grid size={12} sx={{ textAlign: 'left' }}>
            <Card onClick={() => setOpenedDialog('View')}>
                <CardContent>
                    <Typography variant="h6" mb={1}>
                        {readingNote.title}({readingNote.page_number})
                    </Typography>
                    {readingNote.tags.length > 0 && (
                        <Stack direction="row" mb={1} flexWrap="wrap" gap={0.5}>
                            {readingNote.tags.map(tag => (
                                <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                            ))}
                        </Stack>
                    )}
                    <div className="line-clamp">{readingNote.text}</div>
                </CardContent>
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

type ViewDialogType = 'Edit' | 'Delete';

const ReadingNoteViewDialog = ({ readingNote, onClose }: { readingNote: ReadingNoteType; onClose: () => void }) => {
    const [openedDialog, setOpenedDialog] = useState<ViewDialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [showEditButton, setShowEditButton] = useState(false);

    const { deleteReadingNote } = useReadingNoteContext();
    const { getTagColor } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <ReadingNoteDialog onClose={() => setOpenedDialog(undefined)} readingNote={readingNote} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteReadingNote(readingNote.id);
                            setOpenedDialog(undefined);
                        }}
                        title="Delete ReadingNote"
                        message="This ReadingNote will be permanently deleted. (Linked Tags will not be deleted)."
                        actionName="Delete"
                    />
                );
        }
    };
    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ padding: 2, backgroundColor: 'background.default' }}>
                <AppBar position="fixed" sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant="dense">
                        <IconButton onClick={onClose}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                        <div style={{ flexGrow: 1 }} />
                        <Typography>
                            {readingNote.title}({readingNote.page_number})
                        </Typography>
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
                    </Toolbar>
                </AppBar>
                <Box mt={6}>
                    <Typography>{format(readingNote.date, 'yyyy-MM-dd E')}</Typography>
                    <Stack direction="row" mb={1} flexWrap="wrap" gap={0.5}>
                        {readingNote.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Stack>
                    <Card sx={{ textAlign: 'left' }} onClick={() => setShowEditButton(prev => !prev)}>
                        <CardContent>
                            <Typography fontSize="0.9rem" whiteSpace="pre-wrap" overflow="auto">
                                {readingNote.text}
                            </Typography>
                            <AbsoluteEditButton onClick={() => setOpenedDialog('Edit')} size="large" bottom={10} right={20} visible={showEditButton} />
                        </CardContent>
                    </Card>
                </Box>
                {openedDialog && getDialog()}
            </DialogContent>
        </Dialog>
    );
};

export default memo(ReadingNote);
