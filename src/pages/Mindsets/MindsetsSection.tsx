import { IconButton, Stack, Typography, Paper, CircularProgress, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';
import useMindsetContext from '../../hooks/useMindsetContext';
import SortIcon from '@mui/icons-material/Sort';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MindsetDialog from './dialogs/MindsetDialog';
import type { Mindset } from '../../types/my_way';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { MindsetIcon } from '../../components/CustomIcons';
import ArchivedMindsetsDialog from './dialogs/ArchivedMindsetsDialog';
import SortMindsetsDialog from './dialogs/SortMindsetsDialog';

type DialogType = 'CreateMindset' | 'SortMindsets' | 'ArchivedMindsets';

const MindsetsSection = () => {
    const { isLoading, getMindsets, mindsets } = useMindsetContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateMindset':
                return <MindsetDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'SortMindsets':
                return <SortMindsetsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchivedMindsets':
                return <ArchivedMindsetsDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (mindsets === undefined && !isLoading) getMindsets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mindsets, getMindsets]);
    return (
        <>
            <Stack direction='row' justifyContent='space-between'>
                <Stack direction='row' mt={0.5}>
                    <MindsetIcon />
                    <Typography variant='h6' textAlign='left'>
                        心掛け
                    </Typography>
                </Stack>
                <Stack direction='row'>
                    <IconButton onClick={() => setOpenedDialog('SortMindsets')} aria-label='add' color='primary'>
                        <SortIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('ArchivedMindsets')} aria-label='add' color='primary'>
                        <RestoreIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('CreateMindset')} aria-label='add' color='primary'>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack spacing={1} sx={{ textAlign: 'left' }}>
                {isLoading ? (
                    <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                ) : (
                    mindsets?.map(mindset => {
                        return <MindsetItem key={mindset.id} mindset={mindset} />;
                    })
                )}
            </Stack>
            {openedDialog && getDialog()}
        </>
    );
};

const MindsetItem = ({ mindset }: { mindset: Mindset }) => {
    const { archiveMindset } = useMindsetContext();

    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Archive'>();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return (
                    <MindsetDialog
                        mindset={mindset}
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
                            archiveMindset(mindset.id);
                            setOpenedDialog(undefined);
                        }}
                        title='心掛け：一旦保留'
                        message={`「${mindset.name}」を一旦保留にします。`}
                        actionName='一旦保留する'
                    />
                );
        }
    };
    return (
        <Paper key={mindset.id} sx={{ py: 1, px: 2 }}>
            <Stack direction='row' justifyContent='space-between'>
                <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                    {mindset.name}
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
            <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                {mindset.description}
            </Typography>
            {openedDialog && getDialog()}
        </Paper>
    );
};

export default MindsetsSection;
