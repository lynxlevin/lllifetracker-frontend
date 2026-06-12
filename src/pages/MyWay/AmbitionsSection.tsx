import { IconButton, Stack, Typography, Paper, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText, Button, Divider, Grow } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import SortIcon from '@mui/icons-material/Sort';
import InventoryIcon from '@mui/icons-material/Inventory';
import EjectIcon from '@mui/icons-material/Eject';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import AmbitionDialog from './dialogs/ambitions/AmbitionDialog';
import type { Ambition } from '../../types/my_way';
import { AmbitionIcon } from '../../components/CustomIcons';
import ArchivedAmbitionsDialog from './dialogs/ambitions/ArchivedAmbitionsDialog';
import SortAmbitionsDialog from './dialogs/ambitions/SortAmbitionsDialog';
import useLocalStorage from '../../hooks/useLocalStorage';
import AmbitionDetails from './dialogs/ambitions/AmbitionDetails';
import { TransitionGroup } from 'react-transition-group';
import { grey } from '@mui/material/colors';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import useHorizontalSwipe from '../../hooks/useHorizontalSwipe';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems';
type DisplayMode = 'Full' | 'TitleOnly';

const AmbitionsSection = () => {
    const { isLoading, getAmbitions, ambitions } = useAmbitionContext();
    const { ambitionsDisplayMode, setAmbitionsDisplayMode } = useLocalStorage();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const mapAmbitions = () => {
        if (isLoading || ambitions === undefined) return <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;
        const filteredAmbitions = ambitionsDisplayMode.archivedItems === 'Hide' ? ambitions.filter(ambition => !ambition.archived) : ambitions;
        if (filteredAmbitions.length === 0)
            return (
                <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                    <AddIcon /> 新規作成
                </Button>
            );

        return filteredAmbitions.map(ambition => {
            return <AmbitionItem key={ambition.id} ambition={ambition} displayMode={ambitionsDisplayMode.item} />;
        });
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <AmbitionDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Sort':
                return <SortAmbitionsDialog onClose={() => setOpenedDialog(undefined)} displayModeArchivedItem={ambitionsDisplayMode.archivedItems} />;
            case 'ArchivedItems':
                return <ArchivedAmbitionsDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (ambitions === undefined && !isLoading) getAmbitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitions, getAmbitions]);
    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Stack direction="row" mt={0.5} alignItems="center">
                    <AmbitionIcon size="small" />
                    <Typography variant="h6" textAlign="left">
                        大望
                    </Typography>
                </Stack>
                <Stack direction="row">
                    {ambitionsDisplayMode.archivedItems === 'Show' ? (
                        <IconButton
                            onClick={() => {
                                setAmbitionsDisplayMode({ ...ambitionsDisplayMode, archivedItems: 'Hide' });
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            onClick={() => {
                                setAmbitionsDisplayMode({ ...ambitionsDisplayMode, archivedItems: 'Show' });
                                setMenuAnchor(null);
                            }}
                        >
                            <VisibilityOffIcon />
                        </IconButton>
                    )}
                    <IconButton
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
                                <InventoryIcon />
                            </ListItemIcon>
                            <ListItemText>保管庫</ListItemText>
                        </MenuItem>
                        <Divider />
                        <Typography variant="body2" textAlign="center" color="grey">
                            表示オプション
                        </Typography>
                        <MenuItem
                            onClick={() => {
                                setAmbitionsDisplayMode({ ...ambitionsDisplayMode, item: 'TitleOnly' });
                                setMenuAnchor(null);
                            }}
                            disabled={ambitionsDisplayMode.item === 'TitleOnly'}
                        >
                            <ListItemIcon>
                                <ShortTextIcon />
                            </ListItemIcon>
                            <ListItemText>名前だけ表示</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setAmbitionsDisplayMode({ ...ambitionsDisplayMode, item: 'Full' });
                                setMenuAnchor(null);
                            }}
                            disabled={ambitionsDisplayMode.item === 'Full'}
                        >
                            <ListItemIcon>
                                <NotesIcon />
                            </ListItemIcon>
                            <ListItemText>詳細も表示</ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
            </Stack>
            <Stack spacing={1} sx={{ textAlign: 'left', mt: 1, minHeight: '50px' }}>
                {mapAmbitions()}
            </Stack>
            {openedDialog && getDialog()}
        </>
    );
};

const AmbitionItem = ({ ambition, displayMode }: { ambition: Ambition; displayMode: DisplayMode }) => {
    const { archiveAmbition, unarchiveAmbition, deleteAmbition } = useAmbitionContext();
    const [openedDialog, setOpenedDialog] = useState<'Details' | 'Archive' | 'Unarchive' | 'Delete'>();
    const { swipedLeft, cancelSwipe, HorizontalSwipeBox } = useHorizontalSwipe();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Details':
                return <AmbitionDetails ambition={ambition} onClose={() => setOpenedDialog(undefined)} />;
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveAmbition(ambition.id);
                            cancelSwipe();
                            setOpenedDialog(undefined);
                        }}
                        title="大望：しまっておく"
                        message={`「${ambition.name}」をしまっておきます。`}
                        actionName="しまっておく"
                    />
                );
            case 'Unarchive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            unarchiveAmbition(ambition.id);
                            cancelSwipe();
                            setOpenedDialog(undefined);
                        }}
                        title="大望：保管庫から出す"
                        message={`「${ambition.name}」を保管庫から出します。`}
                        actionName="保管庫から出す"
                    />
                );
            case 'Delete':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            deleteAmbition(ambition.id);
                            setOpenedDialog(undefined);
                        }}
                        title="大望：削除"
                        message={`「${ambition.name}」を完全に削除します。`}
                        actionName="削除"
                        actionColor="error"
                    />
                );
        }
    };
    return (
        <>
            <HorizontalSwipeBox distance={100}>
                <Stack direction="row" alignItems="center">
                    <Paper
                        sx={{ py: 1, px: 2, position: 'relative', flexGrow: 1, backgroundColor: ambition.archived ? '#ededed' : 'white' }}
                        onClick={() => setOpenedDialog('Details')}
                    >
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                                {ambition.name}
                            </Typography>
                            {displayMode === 'TitleOnly' && (
                                <Stack direction="row" alignItems="center">
                                    <InfoIcon sx={{ color: grey[500], fontSize: '1.2em' }} />
                                </Stack>
                            )}
                        </Stack>
                        {displayMode === 'Full' && (
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                {ambition.description}
                            </Typography>
                        )}
                    </Paper>
                    <TransitionGroup>
                        {swipedLeft && (
                            <Grow in={swipedLeft}>
                                {ambition.archived ? (
                                    <Stack direction="row">
                                        <IconButton onClick={() => setOpenedDialog('Unarchive')}>
                                            <EjectIcon />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => setOpenedDialog('Delete')}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Stack>
                                ) : (
                                    <IconButton onClick={() => setOpenedDialog('Archive')}>
                                        <InventoryIcon />
                                    </IconButton>
                                )}
                            </Grow>
                        )}
                    </TransitionGroup>
                </Stack>
            </HorizontalSwipeBox>
            {openedDialog && getDialog()}
        </>
    );
};

export default AmbitionsSection;
