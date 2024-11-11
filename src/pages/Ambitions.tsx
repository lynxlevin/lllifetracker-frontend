import { useContext, useEffect } from 'react';
import { Box, Typography, Container, CssBaseline } from '@mui/material';
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
    }, [ambitionsWithLinks, getAmbitionsWithLinks, isLoading]);

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
                <Typography component='h1' variant='h4'>
                    Lynx Levin's
                </Typography>
                <Typography component='h1' variant='h4'>
                    Life Tracker
                </Typography>
                <Typography component='h1' variant='h5' sx={{ mt: 2 }}>
                    Test
                </Typography>
                {ambitionsWithLinks?.map(ambition => {
                    return <Typography key={ambition.id}>{ambition.name}</Typography>;
                })}
            </Box>
        </Container>
    );
};

export default Ambitions;
