import { useEffect } from 'react';
import { Box, Typography, Stack, Paper, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BasePage from '../../components/BasePage';
import useObjectiveContext from '../../hooks/useObjectiveContext';
import { ActionTypography, ObjectiveTypography } from '../../components/CustomTypography';
import useUserAPI from '../../hooks/useUserAPI';
// import AppIcon from '../components/AppIcon';

const Objectives = () => {
    const { isLoggedIn } = useUserAPI();
    const { isLoading, objectivesWithLinks, getObjectivesWithLinks } = useObjectiveContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (objectivesWithLinks === undefined && !isLoading && isLoggedIn) getObjectivesWithLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [objectivesWithLinks, getObjectivesWithLinks]);
    return (
        <BasePage isLoading={isLoading} pageName='Ambitions'>
            <Box sx={{ position: 'relative', pt: 0.5 }}>
                <IconButton
                    onClick={() => {
                        navigate('/ambitions');
                    }}
                    aria-label='ambitions'
                    color='primary'
                    sx={{ position: 'absolute', top: -20, left: 0, fontSize: 18, zIndex: 100 }}
                >
                    <ArrowBackIcon />
                    Ambitions
                </IconButton>
                <IconButton
                    onClick={() => {
                        navigate('/actions');
                    }}
                    aria-label='actions'
                    color='primary'
                    sx={{ position: 'absolute', top: -20, right: 0, fontSize: 18, zIndex: 100 }}
                >
                    Actions
                    <ArrowForwardIcon />
                </IconButton>
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'left', mt: 3 }}>
                    <Typography variant='h5'>目標</Typography>
                </Box>
                <Stack spacing={2} sx={{ width: '100%', textAlign: 'left', pt: 2, pb: 5 }}>
                    {objectivesWithLinks?.map(objective => {
                        return (
                            <Paper key={objective.id} sx={{ p: 1 }}>
                                <ObjectiveTypography name={objective.name} description={objective.description} variant='h6' />
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    {objective.actions.map(action => {
                                        return (
                                            <Paper key={`${objective.id}-${action.id}`} sx={{ padding: 1 }}>
                                                <ActionTypography name={action.name} description={action.description} />
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            </Paper>
                        );
                    })}
                </Stack>
            </Box>
        </BasePage>
    );
};

export default Objectives;
