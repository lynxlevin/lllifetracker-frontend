import {
    IconButton,
    Stack,
    Typography,
    Paper,
    CircularProgress,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tabs,
    Tab,
    AppBar,
    Toolbar,
    Box,
    Dialog,
    DialogContent,
    Button,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import useDesiredStateContext from '../../../../hooks/useDesiredStateContext';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import SortIcon from '@mui/icons-material/Sort';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import CategoryIcon from '@mui/icons-material/Category';
import StarsIcon from '@mui/icons-material/Stars';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddIcon from '@mui/icons-material/Add';
import DesiredStateDialog from './DesiredStateDialog';
import type { DesiredState } from '../../../../types/my_way';
import ConfirmationDialog from '../../../../components/ConfirmationDialog';
import { DesiredStateIcon } from '../../../../components/CustomIcons';
import ArchivedDesiredStatesDialog from './ArchivedDesiredStatesDialog';
import SortDesiredStatesDialog from './SortDesiredStatesDialog';
import useDesiredStateCategoryContext from '../../../../hooks/useDesiredStateCategoryContext';
import DesiredStateCategoryListDialog from './DesiredStateCategoryListDialog';
import { yellow } from '@mui/material/colors';
import AbsoluteEditButton from '../../../../components/AbsoluteEditButton';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems' | 'CategoryList';

const FOCUS_ITEMS = 'FOCUS_ITEMS';

interface Props {
    onClose: () => void;
    selectedCategoryId: string | null;
    onSelectCategory: (_: React.SyntheticEvent, newValue: string | null) => void;
    selectedDesiredStateId?: string;
    setSelectedDesiredStateId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const DesiredStatesDialog = ({ onClose, selectedCategoryId, onSelectCategory, selectedDesiredStateId, setSelectedDesiredStateId }: Props) => {
    const { isLoading: isLoadingDesiredState, getDesiredStates, desiredStates } = useDesiredStateContext();
    const { isLoading: isLoadingCategory, desiredStateCategories, getDesiredStateCategories } = useDesiredStateCategoryContext();

    const focusRef = useRef<HTMLDivElement>(null);

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [desiredStateIdToShowEditButton, setDesiredStateIdToShowEditButton] = useState<string>();

    const noCategoryDesiredStates = useMemo(() => {
        return desiredStates?.filter(desiredState => desiredState.category_id === null);
    }, [desiredStates]);

    const showNoCategory = useMemo(() => {
        if (selectedCategoryId === null) return true;
        return noCategoryDesiredStates !== undefined && noCategoryDesiredStates.length > 0;
    }, [noCategoryDesiredStates, selectedCategoryId]);

    const mapDesiredStates = () => {
        if (desiredStates === undefined || isLoadingDesiredState) return;
        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;

        const filtered = desiredStates!.filter(
            desiredState => (selectedCategoryId === FOCUS_ITEMS && desiredState.is_focused) || desiredState.category_id === selectedCategoryId,
        );
        const items = filtered.map(desiredState => {
            return (
                <Box
                    onClick={e => {
                        e.stopPropagation();
                        setDesiredStateIdToShowEditButton(prev => {
                            if (selectedDesiredStateId !== desiredState.id) return undefined;
                            return prev === desiredState.id ? undefined : desiredState.id;
                        });
                        setSelectedDesiredStateId(desiredState.id);
                    }}
                    ref={desiredState.id === selectedDesiredStateId ? focusRef : undefined}
                    key={desiredState.id}
                >
                    <DesiredStateItem
                        desiredState={desiredState}
                        showCategory={selectedCategoryId === FOCUS_ITEMS}
                        focused={desiredState.id === selectedDesiredStateId}
                        greyed={selectedDesiredStateId !== undefined && desiredState.id !== selectedDesiredStateId}
                        showEditButton={desiredState.id === desiredStateIdToShowEditButton}
                    />
                </Box>
            );
        });

        if (selectedCategoryId === FOCUS_ITEMS || items.length > 0) return items;
        return (
            <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                <AddIcon /> 新規作成
            </Button>
        );
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                const categoryId = selectedCategoryId === null || [FOCUS_ITEMS].includes(selectedCategoryId) ? undefined : selectedCategoryId;
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} defaultParams={{ categoryId }} />;
            case 'Sort':
                return <SortDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedItems':
                return <ArchivedDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'CategoryList':
                return <DesiredStateCategoryListDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            if (focusRef.current === null) return;
            focusRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusRef.current]);

    useEffect(() => {
        if (desiredStates === undefined && !isLoadingDesiredState) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);

    useEffect(() => {
        if (desiredStateCategories === undefined && !isLoadingCategory) getDesiredStateCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStateCategories, getDesiredStateCategories]);
    return (
        <Dialog open={true} onClose={onClose} fullScreen onClick={() => setSelectedDesiredStateId(undefined)}>
            <DialogContent sx={{ padding: 4, backgroundColor: 'background.default' }}>
                <AppBar position="fixed" sx={{ bgcolor: 'primary.light' }} elevation={0}>
                    <Toolbar variant="dense">
                        <IconButton onClick={onClose}>
                            <KeyboardBackspaceIcon />
                        </IconButton>
                        <div style={{ flexGrow: 1 }} />
                        <DesiredStateIcon />
                        <Typography variant="h6" textAlign="left">
                            マイルストーン
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
                                    setOpenedDialog('Create');
                                }}
                            >
                                <ListItemIcon>
                                    <AddIcon />
                                </ListItemIcon>
                                <ListItemText>追加</ListItemText>
                            </MenuItem>
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
                        </Menu>
                    </Toolbar>
                </AppBar>
                {desiredStateCategories === undefined || isLoadingCategory ? (
                    <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto', marginTop: 5 }} />
                ) : (
                    <>
                        <AppBar position="fixed" sx={{ top: '47px', bgcolor: 'background.default' }} elevation={0}>
                            <Tabs value={selectedCategoryId} onChange={onSelectCategory} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                                <Tab label="注力" value={FOCUS_ITEMS} />
                                {desiredStateCategories!.map(category => {
                                    return <Tab key={category.id} label={category.name} value={category.id} />;
                                })}
                                {showNoCategory && <Tab label="なし" value={null} />}
                            </Tabs>
                        </AppBar>
                        <Box mt={9}>
                            <Stack spacing={1} sx={{ textAlign: 'left', mt: 1, minHeight: '50px' }}>
                                {mapDesiredStates()}
                            </Stack>
                        </Box>
                    </>
                )}
                {openedDialog && getDialog()}
            </DialogContent>
        </Dialog>
    );
};

const DesiredStateItem = ({
    desiredState,
    showCategory,
    focused,
    greyed,
    showEditButton,
}: {
    desiredState: DesiredState;
    showCategory: boolean;
    focused: boolean;
    greyed: boolean;
    showEditButton: boolean;
}) => {
    const { archiveDesiredState, updateDesiredState } = useDesiredStateContext();
    const { desiredStateCategories } = useDesiredStateCategoryContext();

    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Archive'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const category = desiredStateCategories!.find(category => category.id === desiredState.category_id);

    const turnOnIsFocused = () => {
        updateDesiredState(desiredState.id, desiredState.name, desiredState.description, desiredState.category_id, true);
    };

    const turnOffIsFocused = () => {
        updateDesiredState(desiredState.id, desiredState.name, desiredState.description, desiredState.category_id, false);
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return (
                    <DesiredStateDialog
                        desiredState={desiredState}
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveDesiredState(desiredState.id);
                            setOpenedDialog(undefined);
                        }}
                        title="マイルストーン：一旦保留する"
                        message={`「${desiredState.name}」を一旦保留にします。`}
                        actionName="一旦保留する"
                    />
                );
        }
    };
    return (
        <Paper key={desiredState.id} sx={{ py: 1, px: 2, backgroundColor: greyed ? '#f7f7f7' : undefined, position: 'relative' }} elevation={focused ? 6 : 0}>
            {desiredState.is_focused && <StarsIcon sx={{ position: 'absolute', top: '-2px', left: 0, fontSize: '1.2rem', color: yellow[700] }} />}
            <Stack direction="row" justifyContent="space-between" alignItems="start">
                <Stack>
                    {showCategory && category && (
                        <Typography variant="body2" fontWeight={100}>
                            {category.name}
                        </Typography>
                    )}
                    <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                        {desiredState.name}
                    </Typography>
                </Stack>
                <IconButton
                    size="small"
                    onClick={event => {
                        setMenuAnchor(event.currentTarget);
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
                    {desiredState.is_focused ? (
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                turnOffIsFocused();
                            }}
                        >
                            <ListItemIcon>
                                <StarsIcon />
                            </ListItemIcon>
                            <ListItemText>注力しない</ListItemText>
                        </MenuItem>
                    ) : (
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                turnOnIsFocused();
                            }}
                        >
                            <ListItemIcon>
                                <StarsIcon sx={{ color: yellow[700] }} />
                            </ListItemIcon>
                            <ListItemText>注力する</ListItemText>
                        </MenuItem>
                    )}
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
                            setOpenedDialog('Archive');
                        }}
                    >
                        <ListItemIcon>
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText>一旦保留</ListItemText>
                    </MenuItem>
                </Menu>
            </Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                {desiredState.description}
            </Typography>
            {openedDialog && getDialog()}
            {showEditButton && <AbsoluteEditButton onClick={() => setOpenedDialog('Edit')} size="small" bottom={3} right={3} />}
        </Paper>
    );
};

export default DesiredStatesDialog;
