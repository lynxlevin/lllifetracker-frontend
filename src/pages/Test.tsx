import { useContext } from 'react';
import { Box, Button, Typography, Container, CssBaseline } from '@mui/material';
import { Navigate, Link } from 'react-router-dom';
import { UserContext } from '../contexts/user-context';
import useUserAPI from '../hooks/useUserAPI';
// import AppIcon from '../components/AppIcon';

const Test = () => {
    const userContext = useContext(UserContext);
    const { handleLogout } = useUserAPI();

    if (userContext.isLoggedIn === false) {
        return <Navigate to="/login" />;
    }
    return (
        <Container component="main" maxWidth="xs">
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
                <Typography component="h1" variant="h4">
                    Lynx Levin's
                </Typography>
                <Typography component="h1" variant="h4">
                    Life Tracker
                </Typography>
                <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
                    Test
                </Typography>
                <br />
                <Link to="/login">Login</Link>
                <br />
                <br />
                <Link to="/">Root</Link>
                <Button fullWidth variant="contained" onClick={handleLogout} sx={{ mt: 3, mb: 2 }}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Test;
