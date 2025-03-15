import { useEffect, useState } from 'react';
import { Box, Stack, Paper, IconButton } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import BasePage from '../../../components/BasePage';
import useDesiredStateContext from '../../../hooks/useDesiredStateContext';
import { ActionTypography, DesiredStateTypography } from '../../../components/CustomTypography';
import DesiredStateDialog from './Dialogs/DesiredStateDialog';
import DesiredStateMenu from './Menus/DesiredStateMenu';
import DesiredStateSettingsDialog from './Dialogs/DesiredStateSettingsDialog';
// import AppIcon from '../components/AppIcon';

type DialogType = 'Create' | 'Settings';

const DesiredStates = () => {
    const { isLoading, desiredStatesWithLinks, getDesiredStatesWithLinks } = useDesiredStateContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <DesiredStateDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Settings':
                return <DesiredStateSettingsDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (desiredStatesWithLinks === undefined && !isLoading) getDesiredStatesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStatesWithLinks, getDesiredStatesWithLinks]);
    return (
        <BasePage isLoading={isLoading} pageName='Ambitions'>
            <>
                <Box sx={{ pt: 0.5 }}>
                    <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                        <IconButton
                            onClick={() => {
                                setOpenedDialog('Create');
                            }}
                            aria-label='add'
                            color='primary'
                            sx={{ position: 'absolute', top: 0, right: 40 }}
                        >
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => {
                                setOpenedDialog('Settings');
                            }}
                            aria-label='add'
                            color='primary'
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <SettingsIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', pt: 2, pb: 5, mt: 6 }}>
                        {desiredStatesWithLinks?.map(desiredState => {
                            return (
                                <Paper key={desiredState.id} sx={{ p: 1, position: 'relative' }}>
                                    <DesiredStateTypography name={desiredState.name} description={desiredState.description} variant='h6' />
                                    <DesiredStateMenu desiredState={desiredState} />
                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                        {desiredState.actions.map(action => {
                                            return (
                                                <Paper key={`${desiredState.id}-${action.id}`} sx={{ padding: 1 }}>
                                                    <ActionTypography name={action.name} />
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Box>
                {openedDialog && getDialog()}
            </>
        </BasePage>
    );
};

export default DesiredStates;
