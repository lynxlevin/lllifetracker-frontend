import { IconButton, Stack, Typography, Paper, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText, Button, Box, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import SortIcon from '@mui/icons-material/Sort';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NotesIcon from '@mui/icons-material/Notes';
import AmbitionDialog from './dialogs/ambitions/AmbitionDialog';
import type { Ambition } from '../../types/my_way';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { AmbitionIcon } from '../../components/CustomIcons';
import ArchivedAmbitionsDialog from './dialogs/ambitions/ArchivedAmbitionsDialog';
import SortAmbitionsDialog from './dialogs/ambitions/SortAmbitionsDialog';
import AbsoluteButton from '../../components/AbsoluteButton';
import useLocalStorage from '../../hooks/useLocalStorage';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems';
type DisplayMode = 'Full' | 'TitleOnly';

const AmbitionsSection = () => {
    const { isLoading, getAmbitions, ambitions } = useAmbitionContext();
    const { ambitionsDisplayMode, setAmbitionsDisplayMode } = useLocalStorage();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedAmbitionId, setSelectedAmbitionId] = useState<string>();

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
                    return (
                        <Paper key={ambition.id} sx={{ py: 1, px: 2, position: 'relative' }}>
                            <Box onClick={() => setSelectedAmbitionId(prev => (prev === ambition.id ? undefined : ambition.id))}>
                                <AmbitionItem ambition={ambition} showEditButton={selectedAmbitionId === ambition.id} displayMode={ambitionsDisplayMode} />
                            </Box>
                        </Paper>
                    );
                });
            case 'TitleOnly':
                return (
                    <Paper sx={{ py: 1, px: 2, position: 'relative' }}>
                        {ambitions?.map(ambition => {
                            return (
                                <Box onClick={() => setSelectedAmbitionId(prev => (prev === ambition.id ? undefined : ambition.id))} key={ambition.id}>
                                    <AmbitionItem ambition={ambition} showEditButton={selectedAmbitionId === ambition.id} displayMode={ambitionsDisplayMode} />
                                </Box>
                            );
                        })}
                    </Paper>
                );
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
                <Stack direction="row" mt={0.5}>
                    <AmbitionIcon />
                    <Typography variant="h6" textAlign="left">
                        大志
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
            <Stack spacing={1} sx={{ textAlign: 'left' }}>
                {mapAmbitions()}
            </Stack>
            {openedDialog && getDialog()}
        </>
    );
};

const AmbitionItem = ({ ambition, showEditButton, displayMode }: { ambition: Ambition; showEditButton: boolean; displayMode: DisplayMode }) => {
    const { archiveAmbition } = useAmbitionContext();

    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Archive'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return (
                    <AmbitionDialog
                        ambition={ambition}
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
                            archiveAmbition(ambition.id);
                            setOpenedDialog(undefined);
                        }}
                        title="大志：しまっておく"
                        message={`「${ambition.name}」をしまっておきます。`}
                        actionName="しまっておく"
                    />
                );
        }
    };
    return (
        <>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                    {ambition.name}
                </Typography>
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
                            <InventoryIcon />
                        </ListItemIcon>
                        <ListItemText>しまっておく</ListItemText>
                    </MenuItem>
                </Menu>
            </Stack>
            {displayMode === 'Full' && (
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                    {ambition.description}
                </Typography>
            )}
            {openedDialog && getDialog()}
            <AbsoluteButton
                onClick={() => setOpenedDialog('Edit')}
                size="small"
                bottom={3}
                right={3}
                visible={showEditButton && displayMode === 'Full'}
                icon={<EditIcon fontSize="small" />}
            />
        </>
    );
};

export default AmbitionsSection;
