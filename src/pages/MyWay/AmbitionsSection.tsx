import { Box, IconButton, Stack, Typography, Paper, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AmbitionDialog from './dialogs/ambitions/AmbitionDialog';
import type { Ambition } from '../../types/my_way';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { AmbitionIcon } from '../../components/CustomIcons';
import ArchivedAmbitionsDialog from './dialogs/ambitions/ArchivedAmbitionsDialog';

type DialogType = 'CreateAmbition' | 'EditAmbition' | 'ArchiveAmbition' | 'ArchivedAmbitions';

const AmbitionsSection = () => {
    const { isLoading, getAmbitions, ambitions, archiveAmbition } = useAmbitionContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedAmbition, setSelectedAmbition] = useState<Ambition>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateAmbition':
                return <AmbitionDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'EditAmbition':
                return (
                    <AmbitionDialog
                        ambition={selectedAmbition}
                        onClose={() => {
                            setSelectedAmbition(undefined);
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'ArchiveAmbition':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setSelectedAmbition(undefined);
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveAmbition(selectedAmbition!.id);
                            setSelectedAmbition(undefined);
                            setOpenedDialog(undefined);
                        }}
                        title='大望：アーカイブ'
                        message={`「${selectedAmbition!.name}」をアーカイブします。`}
                        actionName='アーカイブする'
                    />
                );
            case 'ArchivedAmbitions':
                return <ArchivedAmbitionsDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (ambitions === undefined && !isLoading) getAmbitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitions, getAmbitions]);
    return (
        <>
            <Stack direction='row' justifyContent='space-between'>
                <Stack direction='row' mt={0.5}>
                    <AmbitionIcon />
                    <Typography variant='h6' textAlign='left'>
                        大望 / 生きる意義
                    </Typography>
                </Stack>
                <Stack direction='row'>
                    <IconButton onClick={() => setOpenedDialog('ArchivedAmbitions')} aria-label='add' color='primary'>
                        <RestoreIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('CreateAmbition')} aria-label='add' color='primary'>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack spacing={1} sx={{ textAlign: 'left' }}>
                {isLoading ? (
                    <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                ) : (
                    ambitions?.map(ambition => {
                        return (
                            <Paper key={ambition.id} sx={{ py: 1, px: 2 }}>
                                <Stack direction='row' justifyContent='space-between'>
                                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                        {ambition.name}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedAmbition(ambition);
                                                setOpenedDialog('EditAmbition');
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedAmbition(ambition);
                                                setOpenedDialog('ArchiveAmbition');
                                            }}
                                        >
                                            <ArchiveIcon />
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                    {ambition.description}
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

export default AmbitionsSection;
