import { useEffect } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BasePage from '../../components/BasePage';
import useActionContext from '../../hooks/useActionContext';
import { ActionTypography, AmbitionTypography, ObjectiveTypography } from '../../components/CustomTypography';
import useUserAPI from '../../hooks/useUserAPI';
// import AppIcon from '../components/AppIcon';

const Actions = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, actionsWithLinks, getActionsWithLinks } = useActionContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (actionsWithLinks === undefined && !isLoading && isLoggedIn) getActionsWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionsWithLinks, getActionsWithLinks]);
    return (
        <BasePage isLoading={isLoading} pageName='Ambitions'>
            <Box sx={{ position: 'relative', pt: 0.5 }}>
                <IconButton
                    onClick={() => {
                        navigate('/objectives');
                    }}
                    aria-label='objectives'
                    color='primary'
                    sx={{ position: 'absolute', top: -20, left: 0, fontSize: 18, zIndex: 100 }}
                >
                    <ArrowBackIcon />
                    Objectives
                </IconButton>
                <Box sx={{ width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography variant='h5'>行動</Typography>
                    <Stack spacing={1} sx={{ pt: 2 }}>
                        {actionsWithLinks?.map(action => {
                            return (
                                <Paper key={action.id} sx={{ p: 1 }}>
                                    <ActionTypography name={action.name} description={action.description} variant='h6' />
                                    <Stack spacing={1} sx={{ ml: 3 }}>
                                        {action.objectives.map(objective => {
                                            return (
                                                <Paper key={`${action.id}-${objective.id}`} sx={{ padding: 1 }}>
                                                    <ObjectiveTypography name={objective.name} description={objective.description} />
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

export default Actions;
