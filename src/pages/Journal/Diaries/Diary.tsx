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
    Stack,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import { format } from 'date-fns';
import { memo, useState } from 'react';
import type { Diary as DiaryType } from '../../../types/diary';
import DiaryDialog from './Dialogs/DiaryDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useDiaryContext from '../../../hooks/useDiaryContext';
import useTagContext from '../../../hooks/useTagContext';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

interface DiaryProps {
    diary: DiaryType;
}

type DialogType = 'View';

const Diary = ({ diary }: DiaryProps) => {
    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const { getTagColor } = useTagContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'View':
                return <DiaryViewDialog diary={diary} onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    return (
        <Grid size={12} sx={{ textAlign: 'left' }}>
            <Typography ml={1}>{format(diary.date, 'yyyy-MM-dd E')}</Typography>
            <Paper onClick={() => setOpenedDialog('View')} sx={{ padding: 2 }}>
                {diary.tags.length > 0 && (
                    <Stack direction="row" mb={1} flexWrap="wrap" gap={0.5}>
                        {diary.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Stack>
                )}
                <div className="line-clamp">{diary.text}</div>
            </Paper>
            {openedDialog && getDialog()}
        </Grid>
    );
};

type ViewDialogType = 'Edit' | 'Delete';

const DiaryViewDialog = ({ diary, onClose }: { diary: DiaryType; onClose: () => void }) => {
    const [openedDialog, setOpenedDialog] = useState<ViewDialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [tapped, setTapped] = useState(false);

    const { deleteDiary } = useDiaryContext();
    const { getTagColor } = useTagContext();

    const deleteConfirmationTitle = 'Delete Diary';
    const deleteConfirmationMessage = 'This Diary will be permanently deleted. (Linked Tags will not be deleted). Would you like to proceed?';

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return <DiaryDialog onClose={() => setOpenedDialog(undefined)} diary={diary} />;
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => setOpenedDialog(undefined)}
                        handleSubmit={() => {
                            deleteDiary(diary.id);
                            setOpenedDialog(undefined);
                        }}
                        title={deleteConfirmationTitle}
                        message={deleteConfirmationMessage}
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
                        <Typography>{format(diary.date, 'yyyy-MM-dd E')}</Typography>
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
                    <Stack direction="row" mb={1} flexWrap="wrap" gap={0.5}>
                        {diary.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Stack>
                    <Card sx={{ textAlign: 'left' }} onClick={() => setTapped(prev => !prev)}>
                        <CardContent>
                            <Typography fontSize="0.9rem" whiteSpace="pre-wrap" overflow="auto">
                                {diary.text}
                            </Typography>
                            {tapped && (
                                <IconButton
                                    onClick={() => setOpenedDialog('Edit')}
                                    size="large"
                                    sx={{
                                        position: 'absolute',
                                        bottom: 10,
                                        right: 20,
                                        borderRadius: '100%',
                                        backgroundColor: '#fbfbfb',
                                        border: '1px solid #bbb',
                                    }}
                                >
                                    <EditIcon fontSize="large" />
                                </IconButton>
                            )}
                        </CardContent>
                    </Card>
                </Box>

                {openedDialog && getDialog()}
            </DialogContent>
        </Dialog>
    );
};

export default memo(Diary);
