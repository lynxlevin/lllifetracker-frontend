import { Alert, Button, TextField, Box, Typography, Container, CssBaseline } from '@mui/material';
import useLoginPage from '../hooks/useLoginPage';
// import AppIcon from '../components/AppIcon';

const Login = () => {
    const { errorMessage, handleLogin, handleEmailInput, handlePasswordInput } = useLoginPage();
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
                    Sign in
                </Typography>
                <Box sx={{ mt: 1 }}>
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        id='email'
                        label='Email Address'
                        name='email'
                        autoComplete='email'
                        autoFocus
                        onChange={handleEmailInput}
                    />
                    <TextField
                        margin='normal'
                        required
                        fullWidth
                        name='password'
                        label='Password'
                        type='password'
                        id='password'
                        autoComplete='current-password'
                        onChange={handlePasswordInput}
                    />
                    <Button fullWidth variant='contained' onClick={handleLogin} sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>
                    {/* <Grid container>
                        <Grid item xs>
                        <Link href="#" variant="body2">
                            Forgot password?
                        </Link>
                        </Grid>
                        <Grid item>
                        <Link href="#" variant="body2">
                            {"Don't have an account? Sign Up"}
                            </Link>
                            </Grid>
                        </Grid> */}
                    {errorMessage && (
                        <Alert severity='error' sx={{ mt: 3, mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
