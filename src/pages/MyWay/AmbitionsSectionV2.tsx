import { IconButton, Stack, Typography, Paper, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import SortIcon from '@mui/icons-material/Sort';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import AmbitionDialog from './dialogs/ambitions/AmbitionDialog';
import type { Ambition } from '../../types/my_way';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { AmbitionIcon } from '../../components/CustomIcons';
import ArchivedAmbitionsDialog from './dialogs/ambitions/ArchivedAmbitionsDialog';
import SortAmbitionsDialog from './dialogs/ambitions/SortAmbitionsDialog';

type DialogType = 'Create' | 'Sort' | 'ArchivedItems';

const AmbitionsSectionV2 = () => {
    const { isLoading, getAmbitions, ambitions } = useAmbitionContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const mapAmbitions = () => {
        if (isLoading) return;
        <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />;

        const items = ambitions?.map(ambition => {
            return <AmbitionItem key={ambition.id} ambition={ambition} />;
        });
        if (items !== undefined && items.length > 0) return items;
        return (
            <Button variant="outlined" fullWidth onClick={() => setOpenedDialog('Create')}>
                <AddIcon /> 新規作成
            </Button>
        );
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
                                <RestoreIcon />
                            </ListItemIcon>
                            <ListItemText>アーカイブ</ListItemText>
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

const AmbitionItem = ({ ambition }: { ambition: Ambition }) => {
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
                        title="大志：一旦保留する"
                        message={`「${ambition.name}」を一旦保留にします。`}
                        actionName="一旦保留する"
                    />
                );
        }
    };
    return (
        <Paper key={ambition.id} sx={{ py: 1, px: 2 }}>
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
                            <ArchiveIcon />
                        </ListItemIcon>
                        <ListItemText>一旦保留</ListItemText>
                    </MenuItem>
                </Menu>
            </Stack>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                {ambition.description}
            </Typography>
            {openedDialog && getDialog()}
        </Paper>
    );
};

export default AmbitionsSectionV2;
