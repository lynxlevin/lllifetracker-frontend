import { useEffect, useState } from 'react';
import { Box, Stack, Paper, IconButton } from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { ActionTypography, ObjectiveTypography } from '../../components/CustomTypography';
import ActionDialog from './Dialogs/ActionDialog';
import ActionMenu from './Menus/ActionMenu';
import ActionSettingsDialog from './Dialogs/ActionSettingsDialog';
// import AppIcon from '../components/AppIcon';

type DialogType = 'Create' | 'Settings';

const Actions = () => {
    const { isLoading, actionsWithLinks, getActionsWithLinks } = useActionContext();

    const [openedDialog, setOpenedDialog] = useState<DialogType>();

    const getDialog = () => {
        switch (openedDialog) {
            case 'Create':
                return <ActionDialog onClose={() => setOpenedDialog(undefined)} />;
            case 'Settings':
                return <ActionSettingsDialog onClose={() => setOpenedDialog(undefined)} />;
        }
    };

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoading) getActionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsWithLinks, getActionsWithLinks]);
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
                        {actionsWithLinks?.map(action => {
                            return (
                                <Paper key={action.id} sx={{ p: 1, position: 'relative' }}>
                                    <ActionTypography name={action.name} description={action.description} variant='h6' />
                                    <ActionMenu action={action} />
                                    <Stack spacing={1} sx={{ mt: 1 }}>
                                        {action.objectives.map(objective => {
                                            return (
                                                <Paper key={`${action.id}-${objective.id}`} sx={{ padding: 1 }}>
                                                    <ObjectiveTypography name={objective.name} description={objective.description} />
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

export default Actions;
