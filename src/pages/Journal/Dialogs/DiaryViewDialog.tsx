import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Card, CardContent, Chip, IconButton, Typography, Stack, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { format } from 'date-fns';
import { useState } from 'react';
import type { Diary as DiaryType } from '../../../types/journal';
import DiaryDialog from './DiaryDialog';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import useDiaryAPI from '../../../hooks/useDiaryAPI';
import useTagContext from '../../../hooks/useTagContext';
import AbsoluteButton from '../../../components/AbsoluteButton';
import DialogWithAppBar from '../../../components/DialogWithAppBar';

type ViewDialogType = 'Edit' | 'Delete';

export const DiaryViewDialog = ({ diary, onClose }: { diary: DiaryType; onClose: () => void }) => {
    const [openedDialog, setOpenedDialog] = useState<ViewDialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const { deleteDiary } = useDiaryAPI();
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
        <DialogWithAppBar
            onClose={onClose}
            appBarCenterContent={<Typography>{format(diary.date, 'yyyy-MM-dd E')}</Typography>}
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
                    <Stack direction="row" mb={1} flexWrap="wrap" gap={0.5}>
                        {diary.tags.map(tag => (
                            <Chip key={tag.id} label={tag.name} sx={{ backgroundColor: getTagColor(tag) }} />
                        ))}
                    </Stack>
                    <Card sx={{ textAlign: 'left' }}>
                        <CardContent>
                            <Typography fontSize="0.9rem" whiteSpace="pre-wrap" overflow="auto">
                                {diary.text}
                            </Typography>
                            <AbsoluteButton onClick={() => setOpenedDialog('Edit')} bottom={10} right={20} icon={<EditIcon fontSize="large" />} />
                        </CardContent>
                    </Card>
                    {openedDialog && getDialog()}
                </>
            }
            bgColor="grey"
        />
    );
};
