import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Link, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Login from './pages/Login';
import { Button } from '@mui/material';
import { UserAPI } from './apis/UserAPI';
import { UserContext } from './contexts/user-context';
import useUserAPI from './hooks/useUserAPI';
import type { AxiosError } from 'axios';
import type { AmbitionWithLinks } from './types/ambition';
import { AmbitionContext } from './contexts/ambition-context';
import Ambitions from './pages/Ambitions';

const theme = createTheme({
    palette: {
        background: {
            default: '#f5f5f5',
        },
    },
});

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [ambitionWithLinksList, setAmbitionWithLinksList] = useState<AmbitionWithLinks[]>();

    const { handleLogout } = useUserAPI();
    const get_me = async () => {
        const res = await UserAPI.me();
        console.log(res);
    };
    useEffect(() => {
        if (isLoggedIn === null) {
            UserAPI.me()
                .then(() => {
                    setIsLoggedIn(true);
                })
                .catch((e: AxiosError<{ error: string }>) => {
                    setIsLoggedIn(false);
                });
        }
    }, [isLoggedIn]);

    return (
        <div className='App'>
            <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
                <AmbitionContext.Provider value={{ ambitionWithLinksList, setAmbitionWithLinksList }}>
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} dateFormats={{ keyboardDate: 'yyyy/MM/dd', normalDate: 'yyyy/MM/dd' }}>
                            <Routes>
                                <Route
                                    path='/'
                                    element={
                                        <div style={{ fontSize: '24px' }}>
                                            <br />
                                            <Link to='/login'>Login</Link>
                                            <br />
                                            <br />
                                            <Link to='/ambitions'>Ambitions</Link>
                                            <Button fullWidth variant='contained' onClick={get_me} sx={{ mt: 3, mb: 2 }}>
                                                Me
                                            </Button>
                                            <Button fullWidth variant='contained' onClick={handleLogout} sx={{ mt: 3, mb: 2 }}>
                                                Logout
                                            </Button>
                                        </div>
                                    }
                                />
                                <Route path='/login' element={<Login />} />
                                <Route path='/ambitions' element={<Ambitions />} />
                            </Routes>
                        </LocalizationProvider>
                    </ThemeProvider>
                </AmbitionContext.Provider>
            </UserContext.Provider>
        </div>
    );
}

export default App;
