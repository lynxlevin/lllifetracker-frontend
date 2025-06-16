import {
    AppBar,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
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
import { useEffect, useState } from 'react';
import type { DesiredStateCategory } from '../../../../types/my_way';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import DesiredStateCategoryDialog from './DesiredStateCategoryDialog';
import { moveItemDown, moveItemUp } from '../../../../hooks/useArraySort';

interface DesiredStateCategoryListDialogProps {
    onClose: () => void;
}

const DesiredStateCategoryListDialog = ({ onClose }: DesiredStateCategoryListDialogProps) => {
    const { desiredStateCategories: categoriesMaster, bulkUpdateDesiredStateCategoryOrdering, getDesiredStateCategories } = useDesiredStateCategoryContext();
    const [categories, setCategories] = useState<DesiredStateCategory[]>([]);
    const [openedDialog, setOpenedDialog] = useState<'Create'>();
    const [isSortMode, setIsSortMode] = useState(false);

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

    const saveSorting = () => {
        if (categories.length === 0) return;
        bulkUpdateDesiredStateCategoryOrdering(categories.map(category => category.id)).then(_ => {
            getDesiredStateCategories();
            setIsSortMode(false);
        });
    };

    const cancelSorting = () => {
        setCategories(categoriesMaster!);
        setIsSortMode(false);
    };

    useEffect(() => {
        if (categories.length === 0 && categoriesMaster !== undefined && categoriesMaster.length > 0) {
            setCategories(categoriesMaster);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoriesMaster]);

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
                                <IconButton onClick={() => setIsSortMode(true)} aria-label='add' color='primary'>
                                    <SortIcon />
                                </IconButton>
                                <IconButton onClick={() => setOpenedDialog('Create')} disabled={isSortMode} aria-label='add' color='primary'>
                                    <AddCircleOutlineOutlinedIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                        {categories?.map((category, idx) => (
                            <DesiredStateCategoryItem
                                key={category.id}
                                category={category}
                                isSortMode={isSortMode}
                                idx={idx}
                                categoriesLength={categories.length}
                                setCategories={setCategories}
                            />
                        ))}
                    </Box>
                </Container>
                {openedDialog && getDialog()}
            </DialogContent>
            {isSortMode && (
                <DialogActions sx={{ justifyContent: 'center', pb: 2, bgcolor: 'background.default', borderTop: '1px solid #ccc' }}>
                    <>
                        <Button variant='outlined' onClick={cancelSorting} sx={{ color: 'primary.dark' }}>
                            キャンセル
                        </Button>
                        <Button variant='contained' onClick={saveSorting}>
                            保存する
                        </Button>
                    </>
                </DialogActions>
            )}
        </Dialog>
    );
};

const DesiredStateCategoryItem = ({
    category,
    isSortMode,
    idx,
    categoriesLength,
    setCategories,
}: {
    category: DesiredStateCategory;
    isSortMode: boolean;
    idx: number;
    categoriesLength: number;
    setCategories: (value: React.SetStateAction<DesiredStateCategory[]>) => void;
}) => {
    const { deleteDesiredStateCategory } = useDesiredStateCategoryContext();
    const { getDesiredStates } = useDesiredStateContext();
    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Delete'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const handleUp = (idx: number) => {
        if (idx === 0) return;
        setCategories(prev => moveItemUp(prev, idx));
    };

    const handleDown = (idx: number) => {
        if (idx === categoriesLength - 1) return;
        setCategories(prev => moveItemDown(prev, idx));
    };

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
        <Stack direction='row'>
            <Paper key={category.id} sx={{ py: 1, px: 2, my: 0.5, width: '100%' }}>
                <Stack direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', lineHeight: '1.5em' }}>
                        {category.name}
                    </Typography>
                    {!isSortMode && (
                        <IconButton
                            size='small'
                            onClick={event => {
                                setMenuAnchor(event.currentTarget);
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
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
            </Paper>
            {isSortMode && (
                <>
                    <IconButton
                        size='small'
                        onClick={() => {
                            handleUp(idx);
                        }}
                        disabled={idx === 0}
                    >
                        <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                        size='small'
                        onClick={() => {
                            handleDown(idx);
                        }}
                        disabled={idx === categoriesLength - 1}
                    >
                        <ArrowDownwardIcon />
                    </IconButton>
                </>
            )}
            {openedDialog && getDialog()}
        </Stack>
    );
};

export default DesiredStateCategoryListDialog;
