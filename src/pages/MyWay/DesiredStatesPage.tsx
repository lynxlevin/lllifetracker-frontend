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
    Container,
    CssBaseline,
    Box,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import useDesiredStateContext from '../../hooks/useDesiredStateContext';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import SortIcon from '@mui/icons-material/Sort';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import CategoryIcon from '@mui/icons-material/Category';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DesiredStateDialog from './dialogs/desired_states/DesiredStateDialog';
import type { DesiredState } from '../../types/my_way';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { DesiredStateIcon } from '../../components/CustomIcons';
import ArchivedDesiredStatesDialog from './dialogs/desired_states/ArchivedDesiredStatesDialog';
import SortDesiredStatesDialog from './dialogs/desired_states/SortDesiredStatesDialog';
import useDesiredStateCategoryContext from '../../hooks/useDesiredStateCategoryContext';
import DesiredStateCategoryListDialog from './dialogs/desired_states/DesiredStateCategoryListDialog';
import { useNavigate } from 'react-router-dom';

type DialogType = 'CreateDesiredState' | 'SortDesiredStates' | 'ArchivedDesiredStates' | 'CategoryList';

const ALL_CATEGORIES = 'ALL_CATEGORIES';
const FOCUS_ITEMS = 'FOCUS_ITEMS';

const DesiredStatesPage = () => {
    const { isLoading: isLoadingDesiredState, getDesiredStates, desiredStates } = useDesiredStateContext();
    const { isLoading: isLoadingCategory, desiredStateCategories, getDesiredStateCategories } = useDesiredStateCategoryContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(FOCUS_ITEMS);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const navigate = useNavigate();

    const onSelectCategory = (_: React.SyntheticEvent, newValue: string | null) => {
        setSelectedCategoryId(newValue);
    };

    const noCategoryDesiredStates = useMemo(() => {
        return desiredStates?.filter(desiredState => desiredState.category_id === null);
    }, [desiredStates]);

    const showNoCategory = useMemo(() => {
        if (selectedCategoryId === null) return true;
        return noCategoryDesiredStates !== undefined && noCategoryDesiredStates.length > 0;
    }, [noCategoryDesiredStates, selectedCategoryId]);

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateDesiredState':
                const categoryId = selectedCategoryId === null || [ALL_CATEGORIES, FOCUS_ITEMS].includes(selectedCategoryId) ? undefined : selectedCategoryId;
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} defaultParams={{ categoryId }} />;
            case 'SortDesiredStates':
                return <SortDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedDesiredStates':
                return <ArchivedDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'CategoryList':
                return <DesiredStateCategoryListDialog onClose={() => setOpenedDialog(undefined)} />;
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
        <Container component="main" maxWidth="xs" sx={{ pb: 2 }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ bgcolor: 'primary.light' }} elevation={0}>
                <Toolbar variant="dense">
                    <IconButton
                        onClick={() => {
                            navigate('/');
                            window.scroll({ top: 0 });
                        }}
                    >
                        <KeyboardBackspaceIcon />
                    </IconButton>
                    <div style={{ flexGrow: 1 }} />
                    <DesiredStateIcon />
                    <Typography variant="h6" textAlign="left">
                        実現のために
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
                                setOpenedDialog('CreateDesiredState');
                            }}
                        >
                            <ListItemIcon>
                                <AddCircleOutlineOutlinedIcon />
                            </ListItemIcon>
                            <ListItemText>追加</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setMenuAnchor(null);
                                setOpenedDialog('SortDesiredStates');
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
                                setOpenedDialog('ArchivedDesiredStates');
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
                <Box mt={7}>
                    <Tabs value={selectedCategoryId} onChange={onSelectCategory} variant="scrollable" scrollButtons allowScrollButtonsMobile>
                        <Tab label="重点項目" value={FOCUS_ITEMS} />
                        {desiredStateCategories!.map(category => {
                            return <Tab key={category.id} label={category.name} value={category.id} />;
                        })}
                        <Tab label="ALL" value={ALL_CATEGORIES} />
                        {showNoCategory && <Tab label="なし" value={null} />}
                    </Tabs>
                    <Stack spacing={1} sx={{ textAlign: 'left', mt: 1, minHeight: '50px' }}>
                        {desiredStates === undefined || isLoadingDesiredState ? (
                            <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                        ) : (
                            desiredStates!
                                .filter(
                                    desiredState =>
                                        selectedCategoryId === ALL_CATEGORIES ||
                                        (selectedCategoryId === FOCUS_ITEMS && desiredState.is_focused) ||
                                        desiredState.category_id === selectedCategoryId,
                                )
                                .map(desiredState => {
                                    return (
                                        <DesiredStateItem key={desiredState.id} desiredState={desiredState} showCategory={selectedCategoryId === FOCUS_ITEMS} />
                                    );
                                })
                        )}
                    </Stack>
                </Box>
            )}
            {openedDialog && getDialog()}
        </Container>
    );
};

const DesiredStateItem = ({ desiredState, showCategory }: { desiredState: DesiredState; showCategory: boolean }) => {
    const { archiveDesiredState } = useDesiredStateContext();
    const { desiredStateCategories } = useDesiredStateCategoryContext();

    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Archive'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const category = desiredStateCategories!.find(category => category.id === desiredState.category_id);

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
                        title="実現のために：一旦保留する"
                        message={`「${desiredState.name}」を一旦保留にします。`}
                        actionName="一旦保留する"
                    />
                );
        }
    };
    return (
        <Paper key={desiredState.id} sx={{ py: 1, px: 2 }}>
            {showCategory && category && (
                <Typography variant="body2" fontWeight={100}>
                    {category.name}
                </Typography>
            )}
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" alignItems="center">
                    <Typography variant="body1">{desiredState.is_focused && '⭐️ '}</Typography>
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
        </Paper>
    );
};

export default DesiredStatesPage;
