import { Box, IconButton, Stack, Typography, Paper, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import useMindsetContext from '../../hooks/useMindsetContext';
import SortIcon from '@mui/icons-material/Sort';
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

type DialogType = 'CreateMindset' | 'EditMindset' | 'SortMindsets' | 'ArchiveMindset' | 'ArchivedMindsets';

const MindsetsSection = () => {
    const { isLoading, getMindsets, mindsets, archiveMindset } = useMindsetContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedMindset, setSelectedMindset] = useState<Mindset>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateMindset':
                return <MindsetDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'EditMindset':
                return (
                    <MindsetDialog
                        mindset={selectedMindset}
                        onClose={() => {
                            setSelectedMindset(undefined);
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'SortMindsets':
                return <SortMindsetsDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'ArchiveMindset':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setSelectedMindset(undefined);
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveMindset(selectedMindset!.id);
                            setSelectedMindset(undefined);
                            setOpenedDialog(undefined);
                        }}
                        title='心掛け：アーカイブ'
                        message={`「${selectedMindset!.name}」をアーカイブします。`}
                        actionName='アーカイブする'
                    />
                );
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
                        return (
                            <Paper key={mindset.id} sx={{ py: 1, px: 2 }}>
                                <Stack direction='row' justifyContent='space-between'>
                                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                        {mindset.name}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedMindset(mindset);
                                                setOpenedDialog('EditMindset');
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedMindset(mindset);
                                                setOpenedDialog('ArchiveMindset');
                                            }}
                                        >
                                            <ArchiveIcon />
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                    {mindset.description}
                                </Typography>
                            </Paper>
                        );
                    })
                )}
            </Stack>
            {openedDialog && getDialog()}
        </>
    );
};

export default MindsetsSection;
