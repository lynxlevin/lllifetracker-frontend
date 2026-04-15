import { IconButton, Stack, Typography, Paper, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText, Button, Divider, Grow } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import SortIcon from '@mui/icons-material/Sort';
import InventoryIcon from '@mui/icons-material/Inventory';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import AmbitionDialog from './dialogs/ambitions/AmbitionDialog';
import type { Ambition } from '../../types/my_way';
import { AmbitionIcon } from '../../components/CustomIcons';
import ArchivedAmbitionsDialog from './dialogs/ambitions/ArchivedAmbitionsDialog';
import SortAmbitionsDialog from './dialogs/ambitions/SortAmbitionsDialog';
import useLocalStorage from '../../hooks/useLocalStorage';
import AmbitionDetails from './dialogs/ambitions/AmbitionDetails';
import HorizontalSwipeBox from '../../components/HorizontalSwipeBox';
import { TransitionGroup } from 'react-transition-group';
import { grey } from '@mui/material/colors';
import ConfirmationDialog from '../../components/ConfirmationDialog';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems';
type DisplayMode = 'Full' | 'TitleOnly';

const AmbitionsSection = () => {
    const { isLoading, getAmbitions, ambitions } = useAmbitionContext();
    const { ambitionsDisplayMode, setAmbitionsDisplayMode } = useLocalStorage();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const mapAmbitions = () => {
        if (isLoading || ambitions === undefined) return <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;
        if (ambitions.length === 0)
            return (
                <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                    <AddIcon /> 新規作成
                </Button>
            );

        switch (ambitionsDisplayMode) {
            case 'Full':
                return ambitions?.map(ambition => {
                    return <AmbitionItem key={ambition.id} ambition={ambition} displayMode={ambitionsDisplayMode} />;
                });
            case 'TitleOnly':
                return ambitions?.map(ambition => {
                    return <AmbitionItem key={ambition.id} ambition={ambition} displayMode={ambitionsDisplayMode} />;
                });
        }
    };

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <AmbitionDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Sort':
                return <SortAmbitionsDialog onClose={() => setOpenedDialog(undefined)} />;
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
            <Stack direction="row" justifyContent="space-between" pb={1}>
                <Stack direction="row" mt={0.5} alignItems="center">
                    <AmbitionIcon size="small" />
                    <Typography variant="h6" textAlign="left">
                        大望
                    </Typography>
                </Stack>
                <Stack direction="row">
                    <IconButton
                        size="small"
                        onClick={event => {
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
                                setAmbitionsDisplayMode('TitleOnly');
                                setMenuAnchor(null);
                            }}
                            disabled={ambitionsDisplayMode === 'TitleOnly'}
                        >
                            <ListItemIcon>
                                <ShortTextIcon />
                            </ListItemIcon>
                            <ListItemText>名前だけ表示</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setAmbitionsDisplayMode('Full');
                                setMenuAnchor(null);
                            }}
                            disabled={ambitionsDisplayMode === 'Full'}
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
    const { archiveAmbition } = useAmbitionContext();
    const [openedDialog, setOpenedDialog] = useState<'Detail' | 'Archive'>();
    const [swipedLeft, setSwipedLeft] = useState(false);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Detail':
                return <AmbitionDetails ambition={ambition} onClose={() => setOpenedDialog(undefined)} />;
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveAmbition(ambition.id);
                            setOpenedDialog(undefined);
                        }}
                        title="大望：しまっておく"
                        message={`「${ambition.name}」をしまっておきます。`}
                        actionName="しまっておく"
                    />
                );
        }
    };
    return (
        <>
            <HorizontalSwipeBox onSwipeLeft={swiped => setSwipedLeft(swiped)} keepSwipeState distance={100}>
                <Stack direction="row" alignItems="center">
                    <Paper sx={{ py: 1, px: 2, position: 'relative', flexGrow: 1 }} onClick={() => setOpenedDialog('Detail')}>
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
                                <IconButton onClick={() => setOpenedDialog('Archive')}>
                                    <InventoryIcon />
                                </IconButton>
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
