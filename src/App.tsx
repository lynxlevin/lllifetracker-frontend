import { ThemeProvider, createTheme } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Login from './pages/Login';
import { UserAPI } from './apis/UserAPI';
import { UserContext } from './contexts/user-context';
import type { AxiosError } from 'axios';
import type { AmbitionWithLinks } from './types/ambition';
import { AmbitionContext } from './contexts/ambition-context';
import Ambitions from './pages/Ambitions';
import type { Objective, ObjectiveWithLinks } from './types/objective';
import { ObjectiveContext } from './contexts/objective-context';
import type { Action, ActionWithLinks } from './types/action';
import { ActionContext } from './contexts/action-context';
import { amber, grey, red, teal } from '@mui/material/colors';
import Objectives from './pages/Objectives';
import Actions from './pages/Actions';
import Top from './pages/Top';
import type { Memo } from './types/memo';
import { MemoContext } from './contexts/memo-context';
import Memos from './pages/Memos';
import type { Tag } from './types/tag';
import { TagContext } from './contexts/tag-context';
import type { MissionMemo } from './types/mission_memo';
import { MissionMemoContext } from './contexts/mission-memo-context';
import MissionMemos from './pages/MissionMemos';
import { BookExcerptContext } from './contexts/book-excerpt-context';
import type { BookExcerpt } from './types/book_excerpt';
import BookExcerpts from './pages/BookExcerpts';

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
        primary: teal,
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
    const [memoList, setMemoList] = useState<Memo[]>();
    const [missionMemoList, setMissionMemoList] = useState<MissionMemo[]>();
    const [bookExcerptList, setBookExcerptList] = useState<BookExcerpt[]>();
    const [tagList, setTagList] = useState<Tag[]>();

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
                            <MemoContext.Provider value={{ memoList, setMemoList }}>
                                <MissionMemoContext.Provider value={{ missionMemoList, setMissionMemoList }}>
                                    <BookExcerptContext.Provider value={{ bookExcerptList, setBookExcerptList }}>
                                        <TagContext.Provider value={{ tagList, setTagList }}>
                                            <ThemeProvider theme={theme}>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDateFns}
                                                    dateFormats={{ keyboardDate: 'yyyy/MM/dd', normalDate: 'yyyy/MM/dd' }}
                                                >
                                                    <Routes>
                                                        <Route path='/' element={<Top />} />
                                                        <Route path='/login' element={<Login />} />
                                                        <Route path='/ambitions' element={<Ambitions />} />
                                                        <Route path='/objectives' element={<Objectives />} />
                                                        <Route path='/actions' element={<Actions />} />
                                                        <Route path='/memos' element={<Memos />} />
                                                        <Route path='/mission-memos' element={<MissionMemos />} />
                                                        <Route path='/book-excerpts' element={<BookExcerpts />} />
                                                    </Routes>
                                                </LocalizationProvider>
                                            </ThemeProvider>
                                        </TagContext.Provider>
                                    </BookExcerptContext.Provider>
                                </MissionMemoContext.Provider>
                            </MemoContext.Provider>
                        </ActionContext.Provider>
                    </ObjectiveContext.Provider>
                </AmbitionContext.Provider>
            </UserContext.Provider>
        </div>
    );
}

export default App;
