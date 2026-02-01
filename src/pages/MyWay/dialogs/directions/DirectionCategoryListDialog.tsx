import { Box, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import type { DirectionCategory } from '../../../../types/my_way';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SortIcon from '@mui/icons-material/Sort';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import useDirectionCategoryContext from '../../../../hooks/useDirectionCategoryContext';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import useDirectionContext from '../../../../hooks/useDirectionContext';
import DirectionCategoryDialog from './DirectionCategoryDialog';
import { moveItemDown, moveItemUp } from '../../../../hooks/useArraySort';
import DialogWithAppBar from '../../../../components/DialogWithAppBar';

interface DirectionCategoryListDialogProps {
    onClose: () => void;
}

const DirectionCategoryListDialog = ({ onClose }: DirectionCategoryListDialogProps) => {
    const { directionCategories: categoriesMaster, bulkUpdateDirectionCategoryOrdering, getDirectionCategories } = useDirectionCategoryContext();
    const [categories, setCategories] = useState<DirectionCategory[]>([]);
    const [openedDialog, setOpenedDialog] = useState<'Create'>();
    const [isSortMode, setIsSortMode] = useState(false);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return (
                    <DirectionCategoryDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                    />
                );
        }
    };

    const saveSorting = () => {
        if (categories.length === 0) return;
        bulkUpdateDirectionCategoryOrdering(categories.map(category => category.id)).then(_ => {
            getDirectionCategories();
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

    if (isSortMode)
        return (
            <DialogWithAppBar
                onClose={onClose}
                bgColor="grey"
                appBarCenterContent={<Typography>指針カテゴリー一覧</Typography>}
                content={
                    <>
                        {categories?.map((category, idx) => (
                            <DirectionCategoryItem
                                key={category.id}
                                category={category}
                                isSortMode={isSortMode}
                                idx={idx}
                                categoriesLength={categories.length}
                                setCategories={setCategories}
                            />
                        ))}
                        {openedDialog && getDialog()}
                    </>
                }
                bottomPart={
                    <>
                        <Button variant="outlined" onClick={cancelSorting} sx={{ color: 'primary.dark' }}>
                            キャンセル
                        </Button>
                        <Button variant="contained" onClick={saveSorting}>
                            保存する
                        </Button>
                    </>
                }
            />
        );

    return (
        <DialogWithAppBar
            onClose={onClose}
            bgColor="grey"
            appBarCenterContent={<Typography>指針カテゴリー一覧</Typography>}
            content={
                <>
                    <Stack direction="row" justifyContent="space-between">
                        <Box />
                        <Stack direction="row">
                            <IconButton onClick={() => setIsSortMode(true)} aria-label="add" color="primary">
                                <SortIcon />
                            </IconButton>
                            <IconButton onClick={() => setOpenedDialog('Create')} disabled={isSortMode} aria-label="add" color="primary">
                                <AddCircleOutlineOutlinedIcon />
                            </IconButton>
                        </Stack>
                    </Stack>
                    {categories?.map((category, idx) => (
                        <DirectionCategoryItem
                            key={category.id}
                            category={category}
                            isSortMode={isSortMode}
                            idx={idx}
                            categoriesLength={categories.length}
                            setCategories={setCategories}
                        />
                    ))}
                    {openedDialog && getDialog()}
                </>
            }
        />
    );
};

const DirectionCategoryItem = ({
    category,
    isSortMode,
    idx,
    categoriesLength,
    setCategories,
}: {
    category: DirectionCategory;
    isSortMode: boolean;
    idx: number;
    categoriesLength: number;
    setCategories: (value: React.SetStateAction<DirectionCategory[]>) => void;
}) => {
    const { deleteDirectionCategory } = useDirectionCategoryContext();
    const { getDirections } = useDirectionContext();
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
                    <DirectionCategoryDialog
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
                            deleteDirectionCategory(category.id);
                            getDirections();
                            setOpenedDialog(undefined);
                        }}
                        title="指針カテゴリー: 削除する"
                        message={`「${category.name}」を削除します。削除してもカテゴリー内の項目は消えません。`}
                        actionName="削除"
                        actionColor="error"
                    />
                );
        }
    };
    return (
        <Stack direction="row">
            <Paper key={category.id} sx={{ py: 1, px: 2, my: 0.5, width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', lineHeight: '1.5em' }}>
                        {category.name}
                    </Typography>
                    {!isSortMode && (
                        <IconButton
                            size="small"
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
                        size="small"
                        onClick={() => {
                            handleUp(idx);
                        }}
                        disabled={idx === 0}
                    >
                        <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                        size="small"
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

export default DirectionCategoryListDialog;
