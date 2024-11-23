import { useEffect } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import useAmbitionContext from '../../hooks/useAmbitionContext';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BasePage from '../../components/BasePage';
import useObjectiveContext from '../../hooks/useObjectiveContext';
import useActionContext from '../../hooks/useActionContext';
import { ActionTypography, AmbitionTypography, ObjectiveTypography } from '../../components/CustomTypography';
// import AppIcon from '../components/AppIcon';

const AmbitionsObjectivesActions = () => {
    const { isLoading: isLoadingAmbitions, ambitionsWithLinks, getAmbitionsWithLinks } = useAmbitionContext();
    const { isLoading: isLoadingObjectives, objectivesWithLinks, getObjectivesWithLinks } = useObjectiveContext();
    const { isLoading: isLoadingActions, actionsWithLinks, getActionsWithLinks } = useActionContext();
    const navigate = useNavigate();
    const isLoading = isLoadingAmbitions || isLoadingObjectives || isLoadingActions;

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoadingAmbitions) getAmbitionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    useEffect(() => {
        if (objectivesWithLinks === undefined && !isLoadingObjectives) getObjectivesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectivesWithLinks, getObjectivesWithLinks]);

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoadingActions) getActionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsWithLinks, getActionsWithLinks]);
    return (
        <BasePage isLoading={isLoading}>
            <Box sx={{ position: 'relative', pt: 0.5 }}>
                <IconButton
                    onClick={() => {
                        navigate('/ambitions');
                    }}
                    aria-label='ambitions'
                    color='primary'
                    sx={{ position: 'absolute', top: -20, left: 0, fontSize: 18 }}
                >
                    <ArrowBackIcon />
                    Ambitions
                </IconButton>
                <Box sx={{ width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography component='h5' variant='h5'>
                        大望
                    </Typography>
                    <Stack spacing={1}>
                        {ambitionsWithLinks?.map(ambition => {
                            return (
                                <Paper key={ambition.id} sx={{ p: 1 }}>
                                    <AmbitionTypography name={ambition.name} description={ambition.description} variant='h6' />
                                    <Stack spacing={1} sx={{ ml: 3 }}>
                                        {ambition.objectives.map(objective => {
                                            return (
                                                <Paper key={`${ambition.id}-${objective.id}`} sx={{ p: 1, position: 'relative' }}>
                                                    <ObjectiveTypography name={objective.name} />
                                                    <Stack spacing={1} sx={{ ml: 3, mt: 1 }}>
                                                        {objective.actions.map(action => {
                                                            return (
                                                                <Paper key={`${ambition.id}-${objective.id}-${action.id}`} sx={{ p: 1 }}>
                                                                    <ActionTypography name={action.name} />
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
                <Box sx={{ width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography component='h5' variant='h5'>
                        目標
                    </Typography>
                    <Stack spacing={1}>
                        {objectivesWithLinks?.map(objective => {
                            return (
                                <Paper key={objective.id} sx={{ p: 1 }}>
                                    <ObjectiveTypography name={objective.name} variant='h6' />
                                    <Stack spacing={1} sx={{ ml: 3 }}>
                                        {objective.ambitions.map(ambition => {
                                            return (
                                                <Paper key={`${objective.id}-${ambition.id}`} sx={{ padding: 1 }}>
                                                    <AmbitionTypography name={ambition.name} />
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                    <Stack spacing={1} sx={{ ml: 3, mt: 3 }}>
                                        {objective.actions.map(action => {
                                            return (
                                                <Paper key={`${objective.id}-${action.id}`} sx={{ padding: 1 }}>
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
                <Box sx={{ width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography variant='h5'>行動</Typography>
                    <Stack spacing={1}>
                        {actionsWithLinks?.map(action => {
                            return (
                                <Paper key={action.id} sx={{ p: 1 }}>
                                    <ActionTypography name={action.name} variant='h6' />
                                    <Stack spacing={1} sx={{ ml: 3 }}>
                                        {action.objectives.map(objective => {
                                            return (
                                                <Paper key={`${action.id}-${objective.id}`} sx={{ padding: 1 }}>
                                                    <ObjectiveTypography name={objective.name} />
                                                    <Stack spacing={1} sx={{ ml: 3, mt: 1 }}>
                                                        {objective.ambitions.map(ambition => {
                                                            return (
                                                                <Paper key={`${action.id}-${objective.id}-${ambition.id}`} sx={{ padding: 1 }}>
                                                                    <AmbitionTypography name={ambition.name} />
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
            </Box>
        </BasePage>
    );
};

export default AmbitionsObjectivesActions;
