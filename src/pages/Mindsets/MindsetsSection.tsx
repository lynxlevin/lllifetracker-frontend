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
    Grid,
    Card,
    Dialog,
    DialogContent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useMindsetContext from '../../hooks/useMindsetContext';
import InfoIcon from '@mui/icons-material/Info';
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
            <Stack spacing={0} sx={{ textAlign: 'left' }}>
                {isLoading ? (
                    <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                ) : (
                    <Grid container spacing={1}>
                        {mindsets?.map(mindset => {
                            return <MindsetItem key={mindset.id} mindset={mindset} />;
                        })}
                    </Grid>
                )}
            </Stack>
            {openedDialog && getDialog()}
        </>
    );
};

const MindsetItem = ({ mindset }: { mindset: Mindset }) => {
    const [openedDialog, setOpenedDialog] = useState<'Detail' | 'Edit' | 'Archive'>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Detail':
                return <MindsetDetailDialog mindset={mindset} onClose={() => setOpenedDialog(undefined)} />;
        }
    };
    return (
        <Grid size={12}>
            <Card sx={{ pl: 1, py: 0.5, height: '100%' }} onClick={() => setOpenedDialog('Detail')}>
                <Stack direction='row' justifyContent='space-between'>
                    <Typography sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', fontSize: '0.9rem' }}>{mindset.name}</Typography>
                    {/* <IconButton size='small'>
                        <InfoIcon />
                    </IconButton> */}
                </Stack>
            </Card>
            {openedDialog && getDialog()}
        </Grid>
    );
};

const MindsetDetailDialog = ({ onClose, mindset }: { onClose: () => void; mindset: Mindset }) => {
    const [openedDialog, setOpenedDialog] = useState<'Edit' | 'Archive'>();
    const { archiveMindset } = useMindsetContext();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Edit':
                return (
                    <MindsetDialog
                        mindset={mindset}
                        onClose={() => {
                            setOpenedDialog(undefined);
                            onClose();
                        }}
                    />
                );
            case 'Archive':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setOpenedDialog(undefined);
                            onClose();
                        }}
                        handleSubmit={() => {
                            archiveMindset(mindset.id);
                            setOpenedDialog(undefined);
                            onClose();
                        }}
                        title='心掛け：一旦保留'
                        message={`「${mindset.name}」を一旦保留にします。`}
                        actionName='一旦保留する'
                    />
                );
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth>
            <DialogContent>
                <Stack direction='row' justifyContent='space-between' alignItems='center' pb={1}>
                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', lineHeight: '1em' }}>
                        {mindset!.name}
                    </Typography>
                    <Stack direction='row'>
                        <IconButton
                            size='small'
                            onClick={() => {
                                setOpenedDialog('Edit');
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            size='small'
                            onClick={() => {
                                setOpenedDialog('Archive');
                            }}
                        >
                            <ArchiveIcon />
                        </IconButton>
                    </Stack>
                </Stack>
                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                    {mindset!.description}
                </Typography>
            </DialogContent>
            {openedDialog && getDialog()}
        </Dialog>
    );
};

export default MindsetsSection;
