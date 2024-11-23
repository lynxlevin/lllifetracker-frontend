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
import type { Objective, ObjectiveWithLinks } from './types/objective';
import { ObjectiveContext } from './contexts/objective-context';
import type { Action, ActionWithLinks } from './types/action';
import { ActionContext } from './contexts/action-context';
import AmbitionsObjectivesActions from './pages/AmbitionsObjectivesActions/AmbitionsObjectivesActions';
import { amber, grey, red, teal } from '@mui/material/colors';

declare module '@mui/material/styles' {
    interface Palette {
        ambitions: Palette['primary'];
        objectives: Palette['primary'];
        actions: Palette['primary'];
    }
    interface PaletteOptions {
        ambitions?: PaletteOptions['primary'];
        objectives?: PaletteOptions['primary'];
        actions?: PaletteOptions['primary'];
    }
}

const theme = createTheme({
    palette: {
        ambitions: red,
        objectives: teal,
        actions: amber,
        background: { default: grey[100] },
    },
});

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [ambitionWithLinksList, setAmbitionWithLinksList] = useState<AmbitionWithLinks[]>();
    const [objectiveList, setObjectiveList] = useState<Objective[]>();
    const [objectivesWithLinksList, setObjectivesWithLinksList] = useState<ObjectiveWithLinks[]>();
    const [actionList, setActionList] = useState<Action[]>();
    const [actionsWithLinksList, setActionsWithLinksList] = useState<ActionWithLinks[]>();

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
                    <ObjectiveContext.Provider value={{ objectiveList, setObjectiveList, objectivesWithLinksList, setObjectivesWithLinksList }}>
                        <ActionContext.Provider value={{ actionList, setActionList, actionsWithLinksList, setActionsWithLinksList }}>
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
                                                    <Link to='/list'>List</Link>
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
                                        <Route path='/list' element={<AmbitionsObjectivesActions />} />
                                    </Routes>
                                </LocalizationProvider>
                            </ThemeProvider>
                        </ActionContext.Provider>
                    </ObjectiveContext.Provider>
                </AmbitionContext.Provider>
            </UserContext.Provider>
        </div>
    );
}

export default App;
