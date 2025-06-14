import {
    AppBar,
    Box,
    Container,
    Dialog,
    DialogContent,
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Toolbar,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import type { DesiredStateCategory } from '../../../../types/my_way';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import DesiredStateCategoryDialog from './DesiredStateCategoryDialog';

interface DesiredStateCategoryListDialogProps {
    onClose: () => void;
}

const DesiredStateCategoryListDialog = ({ onClose }: DesiredStateCategoryListDialogProps) => {
    const { desiredStateCategories } = useDesiredStateCategoryContext();
    const [openedDialog, setOpenedDialog] = useState<'Create'>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return (
                    <DesiredStateCategoryDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                    />
                );
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullScreen>
            <DialogContent sx={{ pt: 4, bgcolor: 'background.default' }}>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant='dense'>
                        <Typography>そのために、カテゴリー一覧</Typography>
                        <div style={{ flexGrow: 1 }} />
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <Container component='main' maxWidth='xs' sx={{ mt: 4 }}>
                    <Box mt={2}>
                        <Stack direction='row' justifyContent='space-between'>
                            <Box />
                            <Stack direction='row'>
                                <IconButton onClick={() => setOpenedDialog('Create')} aria-label='add' color='primary'>
                                    <AddCircleOutlineOutlinedIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                        {desiredStateCategories?.map(category => (
                            <DesiredStateCategoryItem key={category.id} category={category} />
                        ))}
                    </Box>
                </Container>
                {openedDialog && getDialog()}
            </DialogContent>
        </Dialog>
    );
};

const DesiredStateCategoryItem = ({ category }: { category: DesiredStateCategory }) => {
    const { deleteDesiredStateCategory } = useDesiredStateCategoryContext();
    const { getDesiredStates } = useDesiredStateContext();
    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Delete'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return (
                    <DesiredStateCategoryDialog
                        category={category}
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            deleteDesiredStateCategory(category.id);
                            getDesiredStates();
                            setOpenedDialog(undefined);
                        }}
                        title='望む姿カテゴリー: 削除する'
                        message={`「${category.name}」を削除します。削除してもカテゴリー内の望む姿は消えません。`}
                        actionName='削除する'
                    />
                );
        }
    };
    return (
        <Paper key={category.id} sx={{ py: 1, px: 2, my: 1 }}>
            <Stack direction='row' justifyContent='space-between'>
                <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                    {category.name}
                </Typography>
                <IconButton
                    size='small'
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
            </Stack>
            {openedDialog && getDialog()}
        </Paper>
    );
};

export default DesiredStateCategoryListDialog;
