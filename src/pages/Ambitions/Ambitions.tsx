import { useEffect, useState } from 'react';
import { Box, Stack, Paper, IconButton } from '@mui/material';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AmbitionDialog from './Dialogs/AmbitionDialog';
import AmbitionMenu from './Menus/AmbitionMenu';
import ObjectiveMenu from './Menus/ObjectiveMenu';
import ActionMenu from './Menus/ActionMenu';
import BasePage from '../../components/BasePage';
import { ActionTypography, AmbitionTypography, ObjectiveTypography } from '../../components/CustomTypography';
import useObjectiveContext from '../../hooks/useObjectiveContext';
import useActionContext from '../../hooks/useActionContext';
import useUserAPI from '../../hooks/useUserAPI';
// import AppIcon from '../components/AppIcon';

const Ambitions = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks } = useAmbitionContext();
    const { isLoading: isLoadingObjectives, objectivesWithLinks, getObjectivesWithLinks } = useObjectiveContext();
    const { isLoading: isLoadingActions, actionsWithLinks, getActionsWithLinks } = useActionContext();
    const [isCreateAmbitionDialogOpen, setIsCreateAmbitionDialogOpen] = useState(false);

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoading && isLoggedIn) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    useEffect(() => {
        if (objectivesWithLinks === undefined && !isLoadingObjectives && isLoggedIn) getObjectivesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectivesWithLinks, getObjectivesWithLinks]);

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoadingActions && isLoggedIn) getActionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsWithLinks, getActionsWithLinks]);

    return (
        <BasePage isLoading={isLoading} pageName='Ambitions'>
            <>
                <Box sx={{ pt: 0.5 }}>
                    <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                        <IconButton
                            onClick={() => setIsCreateAmbitionDialogOpen(true)}
                            aria-label='add'
                            color='primary'
                            sx={{ position: 'absolute', top: 0, right: 0 }}
                        >
                            <AddCircleOutlineOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', pt: 2, pb: 5, mt: 6 }}>
                        {ambitionsWithLinks?.map(ambition => {
                            return (
                                <Paper key={ambition.id} sx={{ padding: 1, position: 'relative' }}>
                                    <AmbitionTypography name={ambition.name} description={ambition.description} variant='h6' />
                                    <AmbitionMenu ambition={ambition} />
                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                        {ambition.objectives.map(objective => {
                                            return (
                                                <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1, position: 'relative', paddingRight: 3 }}>
                                                    <ObjectiveTypography name={objective.name} description={objective.description} />
                                                    <ObjectiveMenu objective={objective} />
                                                    <Stack spacing={2} sx={{ mt: 1 }}>
                                                        {objective.actions.map(action => {
                                                            return (
                                                                <Paper
                                                                    key={`${ambition.id}-${objective.id}-${action.id}`}
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
                {isCreateAmbitionDialogOpen && <AmbitionDialog onClose={() => setIsCreateAmbitionDialogOpen(false)} />}
            </>
        </BasePage>
    );
};

export default Ambitions;
