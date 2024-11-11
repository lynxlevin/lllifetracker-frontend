import { useContext, useEffect } from 'react';
import { Box, Typography, Container, CssBaseline, Stack, Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../contexts/user-context';
import useAmbitionContext from '../hooks/useAmbitionContext';
import Loading from './Loading';
// import AppIcon from '../components/AppIcon';

const Ambitions = () => {
    const userContext = useContext(UserContext);

    const { isLoading, ambitionsWithLinks, getAmbitionsWithLinks } = useAmbitionContext();

    useEffect(() => {
        if (ambitionsWithLinks === undefined && !isLoading) getAmbitionsWithLinks();
    }, [ambitionsWithLinks, getAmbitionsWithLinks]);

    if (userContext.isLoggedIn === false) {
        return <Navigate to='/login' />;
    }
    if (isLoading) {
        return <Loading />;
    }
    return (
        <Container component='main' maxWidth='xs'>
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* <AppIcon height={36} /> */}
                <Typography component='h1' variant='h4' sx={{ mt: 2 }}>
                    Ambitions
                </Typography>
                <Stack spacing={2} sx={{ width: '100%', textAlign: 'left' }}>
                    {ambitionsWithLinks?.map(ambition => {
                        return (
                            <Paper key={ambition.id} sx={{ padding: 1 }}>
                                <Typography variant='h6'>{ambition.name}</Typography>
                                <Typography sx={{ marginLeft: 1 }}>{ambition.description}</Typography>
                                <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
                                    {ambition.objectives.map(objective => {
                                        return (
                                            <Paper key={`${ambition.id}-${objective.id}`} sx={{ padding: 1 }}>
                                                <Typography>{objective.name}</Typography>
                                                <Stack spacing={2} sx={{ marginLeft: 3, marginTop: 2 }}>
                                                    {objective.actions.map(action => {
                                                        return (
                                                            <Paper key={`${ambition.id}-${objective.id}-${action.id}`} sx={{ padding: 1 }}>
                                                                <Typography>{action.name}</Typography>
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
        </Container>
    );
};

export default Ambitions;
