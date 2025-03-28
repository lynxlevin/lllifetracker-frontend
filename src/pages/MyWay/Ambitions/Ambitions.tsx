import { useEffect, useState } from 'react';
import { Box, Stack, Paper, IconButton } from '@mui/material';
import useAmbitionContext from '../../../hooks/useAmbitionContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import AmbitionDialog from './Dialogs/AmbitionDialog';
import AmbitionMenu from './Menus/AmbitionMenu';
import DesiredStateMenu from './Menus/DesiredStateMenu';
import ActionMenu from './Menus/ActionMenu';
import BasePage from '../../../components/BasePage';
import { ActionTypography, AmbitionTypography, DesiredStateTypography } from '../../../components/CustomTypography';
import useDesiredStateContext from '../../../hooks/useDesiredStateContext';
import useActionContext from '../../../hooks/useActionContext';
import AmbitionSettingsDialog from './Dialogs/AmbitionSettingsDialog';
// import AppIcon from '../components/AppIcon';

type DialogType = 'Create' | 'Settings';

const Ambitions = () => {
    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks } = useAmbitionContext();
    const { isLoading: isLoadingDesiredStates, desiredStatesWithLinks, getDesiredStatesWithLinks } = useDesiredStateContext();
    const { isLoading: isLoadingActions, actionsWithLinks, getActionsWithLinks } = useActionContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <AmbitionDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Settings':
                return <AmbitionSettingsDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoading) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    useEffect(() => {
        if (desiredStatesWithLinks === undefined && !isLoadingDesiredStates) getDesiredStatesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [desiredStatesWithLinks, getDesiredStatesWithLinks]);

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoadingActions) getActionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsWithLinks, getActionsWithLinks]);

    return (
        <BasePage isLoading={isLoading} pageName='Ambitions'>
            <>
                <Box sx={{ pt: 0.5 }}>
                    <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                        <IconButton onClick={() => setOpenedDialog('Create')} aria-label='add' color='primary' sx={{ position: 'absolute', top: 0, right: 40 }}>
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
                        {ambitionsWithLinks?.map(ambition => {
                            return (
                                <Paper key={ambition.id} sx={{ padding: 1, position: 'relative' }}>
                                    <AmbitionTypography name={ambition.name} description={ambition.description} variant='h6' />
                                    <AmbitionMenu ambition={ambition} />
                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                        {ambition.desired_states.map(desiredState => {
                                            return (
                                                <Paper key={`${ambition.id}-${desiredState.id}`} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                                    <DesiredStateTypography name={desiredState.name} description={desiredState.description} />
                                                    <DesiredStateMenu desiredState={desiredState} />
                                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                                        {desiredState.actions.map(action => {
                                                            return (
                                                                <Paper
                                                                    key={`${ambition.id}-${desiredState.id}-${action.id}`}
                                                                    sx={{ padding: 1, position: 'relative', paddingRight: 3 }}
                                                                >
                                                                    <ActionTypography name={action.name} description={action.description} />
                                                                    <ActionMenu action={action} />
                                                                </Paper>
                                                            );
                                                        })}
                                                    </Stack>
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

export default Ambitions;
