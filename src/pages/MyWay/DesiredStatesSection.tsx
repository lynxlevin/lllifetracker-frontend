import { Box, IconButton, Stack, Typography, Paper, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import useDesiredStateContext from '../../hooks/useDesiredStateContext';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import RestoreIcon from '@mui/icons-material/Restore';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DesiredStateDialog from './DesiredStates/Dialogs/DesiredStateDialog';
import type { DesiredState } from '../../types/my_way';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import { DesiredStateIcon } from '../../components/CustomIcons';
import ArchivedDesiredStatesDialog from './DesiredStates/Dialogs/ArchivedDesiredStatesDialog';

type DialogType = 'CreateDesiredState' | 'EditDesiredState' | 'ArchiveDesiredState' | 'ArchivedDesiredStates';

const DesiredStatesSection = () => {
    const { isLoading, getDesiredStates, desiredStates, archiveDesiredState } = useDesiredStateContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();
    const [selectedDesiredState, setSelectedDesiredState] = useState<DesiredState>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'CreateDesiredState':
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'EditDesiredState':
                return (
                    <DesiredStateDialog
                        desiredState={selectedDesiredState}
                        onClose={() => {
                            setSelectedDesiredState(undefined);
                            setOpenedDialog(undefined);
                        }}
                    />
                );
            case 'ArchiveDesiredState':
                return (
                    <ConfirmationDialog
                        onClose={() => {
                            setSelectedDesiredState(undefined);
                            setOpenedDialog(undefined);
                        }}
                        handleSubmit={() => {
                            archiveDesiredState(selectedDesiredState!.id);
                            setSelectedDesiredState(undefined);
                            setOpenedDialog(undefined);
                        }}
                        title='望む姿：アーカイブ'
                        message={`「${selectedDesiredState!.name}」をアーカイブします。`}
                        actionName='アーカイブする'
                    />
                );
            case 'ArchivedDesiredStates':
                return <ArchivedDesiredStatesDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (desiredStates === undefined && !isLoading) getDesiredStates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStates, getDesiredStates]);
    return (
        <>
            <Stack direction='row' justifyContent='space-between'>
                <Stack direction='row' mt={0.5}>
                    <DesiredStateIcon />
                    <Typography variant='h6' textAlign='left'>
                        目指す姿 / 指針
                    </Typography>
                </Stack>
                <Stack direction='row'>
                    <IconButton onClick={() => setOpenedDialog('ArchivedDesiredStates')} aria-label='add' color='primary'>
                        <RestoreIcon />
                    </IconButton>
                    <IconButton onClick={() => setOpenedDialog('CreateDesiredState')} aria-label='add' color='primary'>
                        <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                </Stack>
            </Stack>
            <Stack spacing={1} sx={{ textAlign: 'left' }}>
                {isLoading ? (
                    <CircularProgress style={{ marginRight: 'auto', marginLeft: 'auto' }} />
                ) : (
                    desiredStates?.map(desiredState => {
                        return (
                            <Paper key={desiredState.id} sx={{ py: 1, px: 2 }}>
                                <Stack direction='row' justifyContent='space-between'>
                                    <Typography variant='body1' sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px', mt: 1, lineHeight: '1em' }}>
                                        {desiredState.name}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedDesiredState(desiredState);
                                                setOpenedDialog('EditDesiredState');
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size='small'
                                            onClick={() => {
                                                setSelectedDesiredState(desiredState);
                                                setOpenedDialog('ArchiveDesiredState');
                                            }}
                                        >
                                            <ArchiveIcon />
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Typography variant='body2' sx={{ whiteSpace: 'pre-wrap', fontWeight: 100 }}>
                                    {desiredState.description}
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

export default DesiredStatesSection;
