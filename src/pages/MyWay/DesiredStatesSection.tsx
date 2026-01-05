import { Stack, Typography, Paper, CircularProgress, IconButton, Button, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import useDesiredStateContext from '../../hooks/useDesiredStateContext';
import type { DesiredState } from '../../types/my_way';
import { DesiredStateIcon } from '../../components/CustomIcons';
import useDesiredStateCategoryContext from '../../hooks/useDesiredStateCategoryContext';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import StarsIcon from '@mui/icons-material/Stars';
import SortIcon from '@mui/icons-material/Sort';
import MenuIcon from '@mui/icons-material/Menu';
import RestoreIcon from '@mui/icons-material/Restore';
import CategoryIcon from '@mui/icons-material/Category';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import DesiredStatesDialog from './dialogs/desired_states/DesiredStatesDialog';
import DesiredStateDialog from './dialogs/desired_states/DesiredStateDialog';
import { grey, yellow } from '@mui/material/colors';
import ArchivedDesiredStatesDialog from './dialogs/desired_states/ArchivedDesiredStatesDialog';
import SortDesiredStatesDialog from './dialogs/desired_states/SortDesiredStatesDialog';
import DesiredStateCategoryListDialog from './dialogs/desired_states/DesiredStateCategoryListDialog';
import useLocalStorage, { DesiredStatesDisplayMode } from '../../hooks/useLocalStorage';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems' | 'CategoryList' | 'Details';

const DesiredStatesSection = () => {
    const { isLoading: isLoadingDesiredState, getDesiredStates, desiredStates } = useDesiredStateContext();
    const { isLoading: isLoadingCategory, desiredStateCategories, getDesiredStateCategories } = useDesiredStateCategoryContext();
    const { desiredStatesDisplayMode, setDesiredStatesDisplayMode } = useLocalStorage();

    const [selectedDesiredStateId, setSelectedDesiredStateId] = useState<string>();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const mapDesiredStates = () => {
        if (desiredStates === undefined || isLoadingDesiredState) return <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;
        if (desiredStates.length === 0)
            return (
                <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                    <AddIcon /> 新規作成
                </Button>
            );

        let lastCategoryId: string | null;
        switch (desiredStatesDisplayMode.item) {
            case 'Full':
                return desiredStates.map(desiredState => {
                    const shouldShowCategory = lastCategoryId !== desiredState.category_id;
                    lastCategoryId = desiredState.category_id;
                    return (
                        <DesiredStateItem
                            key={desiredState.id}
                            desiredState={desiredState}
                            displayMode={desiredStatesDisplayMode}
                            onClick={() => {
                                setOpenedDialog('Details');
                                setSelectedDesiredStateId(desiredState.id);
                            }}
                            shouldShowCategory={shouldShowCategory}
                        />
                    );
                });
            case 'TitleOnly':
                return desiredStates.map(desiredState => {
                    const shouldShowCategory = lastCategoryId !== desiredState.category_id;
                    lastCategoryId = desiredState.category_id;
                    return (
                        <DesiredStateItem
                            key={desiredState.id}
                            desiredState={desiredState}
                            displayMode={desiredStatesDisplayMode}
                            onClick={() => {
                                setOpenedDialog('Details');
                                setSelectedDesiredStateId(desiredState.id);
                            }}
                            shouldShowCategory={shouldShowCategory}
                        />
                    );
                });
        }
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                // MYMEMO: remove categoryId default param
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} defaultParams={{ categoryId: undefined }} />;
            case 'Sort':
                return <SortDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedItems':
                return <ArchivedDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'CategoryList':
                return <DesiredStateCategoryListDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Details':
                return (
                    <DesiredStatesDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            setSelectedDesiredStateId(undefined);
                        }}
                        selectedDesiredStateId={selectedDesiredStateId}
                        setSelectedDesiredStateId={setSelectedDesiredStateId}
                    />
                );
        }
    };

    useEffect(() => {
        if (desiredStates === undefined && !isLoadingDesiredState) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);

    useEffect(() => {
        if (desiredStateCategories === undefined && !isLoadingCategory) getDesiredStateCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStateCategories, getDesiredStateCategories]);
    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" mt={0.5}>
                    <DesiredStateIcon />
                    <Typography variant="h6" textAlign="left">
                        大事にすること
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <IconButton
                        size="small"
                        onClick={() => {
                            setOpenedDialog('Create');
                        }}
                    >
                        <AddIcon />
                    </IconButton>
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
                                setOpenedDialog('Sort');
                            }}
                        >
                            <ListItemIcon>
                                <SortIcon />
                            </ListItemIcon>
                            <ListItemText>並び替え</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('ArchivedItems');
                            }}
                        >
                            <ListItemIcon>
                                <RestoreIcon />
                            </ListItemIcon>
                            <ListItemText>アーカイブ</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('CategoryList');
                            }}
                        >
                            <ListItemIcon>
                                <CategoryIcon />
                            </ListItemIcon>
                            <ListItemText>カテゴリ</ListItemText>
                        </MenuItem>
                        <Divider />
                        <Typography variant="body2" textAlign="center" color="grey">
                            表示オプション
                        </Typography>
                        <MenuItem
                            onClick={() => {
                                setDesiredStatesDisplayMode({ ...desiredStatesDisplayMode, item: 'TitleOnly' });
                                setMenuAnchor(null);
                            }}
                            disabled={desiredStatesDisplayMode.item === 'TitleOnly'}
                        >
                            <ListItemIcon>
                                <ShortTextIcon />
                            </ListItemIcon>
                            <ListItemText>名前だけ表示</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setDesiredStatesDisplayMode({ ...desiredStatesDisplayMode, item: 'Full' });
                                setMenuAnchor(null);
                            }}
                            disabled={desiredStatesDisplayMode.item === 'Full'}
                        >
                            <ListItemIcon>
                                <NotesIcon />
                            </ListItemIcon>
                            <ListItemText>詳細も表示</ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
            </Stack>
            {desiredStateCategories === undefined || isLoadingCategory ? (
                <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
            ) : (
                <Stack spacing={1} sx={{ textAlign: 'left', mt: 1, minHeight: '50px' }}>
                    {mapDesiredStates()}
                </Stack>
            )}
            {openedDialog && getDialog()}
        </>
    );
};

const DesiredStateItem = ({
    desiredState,
    onClick,
    displayMode,
    shouldShowCategory,
}: {
    desiredState: DesiredState;
    onClick: () => void;
    displayMode: DesiredStatesDisplayMode;
    shouldShowCategory: boolean;
}) => {
    const { desiredStateCategories } = useDesiredStateCategoryContext();

    const category = desiredStateCategories!.find(category => category.id === desiredState.category_id);

    return (
        <>
            {shouldShowCategory && (
                <Typography fontSize="1rem" mt={1}>
                    {category?.name ?? 'カテゴリーなし'}
                </Typography>
            )}
            <Paper sx={{ py: 1, px: 2, position: 'relative' }} onClick={onClick}>
                {desiredState.is_focused && <StarsIcon sx={{ position: 'absolute', top: '-2px', left: 0, fontSize: '1.2rem', color: yellow[700] }} />}
                <Stack direction="row" justifyContent="space-between">
                    <div>
                        <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                            {desiredState.name}
                        </Typography>
                    </div>
                    {displayMode.item === 'TitleOnly' && (
                        <Stack direction="row" alignItems="center">
                            <InfoIcon sx={{ color: grey[500], fontSize: '1.2em' }} />
                        </Stack>
                    )}
                </Stack>
                {displayMode.item === 'Full' && (
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                        {desiredState.description}
                    </Typography>
                )}
            </Paper>
        </>
    );
};

export default DesiredStatesSection;
