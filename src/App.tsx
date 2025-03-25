import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Login from './pages/Login';
import { AmbitionProvider } from './contexts/ambition-context';
import Ambitions from './pages/MyWay/Ambitions';
import { DesiredStateProvider } from './contexts/desired-state-context';
import { ActionProvider } from './contexts/action-context';
import { amber, grey, red, teal, orange } from '@mui/material/colors';
import DesiredStates from './pages/MyWay/DesiredStates';
import Actions from './pages/MyWay/Actions';
import { MemoProvider } from './contexts/memo-context';
import Memos from './pages/Notes/Memos';
import { TagProvider } from './contexts/tag-context';
import { ChallengeProvider } from './contexts/challenge-context';
import Challenges from './pages/Notes/Challenges';
import { ReadingNoteProvider } from './contexts/reading-note-context';
import ReadingNotes from './pages/Notes/ReadingNotes';
import { ActionTrackProvider } from './contexts/action-track-context';
import ActionTracks from './pages/ActionTracks';
import Aggregations from './pages/ActionTracks/Aggregations';
import { DiaryProvider } from './contexts/diary-context';
import Diaries from './pages/Journal/Diaries';

declare module '@mui/material/styles' {
    interface Palette {
        ambitions: Palette['primary'];
        desiredStates: Palette['primary'];
        actions: Palette['primary'];
    }
    interface PaletteOptions {
        ambitions?: PaletteOptions['primary'];
        desiredStates?: PaletteOptions['primary'];
        actions?: PaletteOptions['primary'];
    }
}

const theme = createTheme({
    palette: {
        primary: orange,
        ambitions: red,
        desiredStates: teal,
        actions: amber,
        background: { default: grey[200] },
    },
});

function App() {
    return (
        <div className='App'>
            <AmbitionProvider>
                <DesiredStateProvider>
                    <ActionProvider>
                        <MemoProvider>
                            <ChallengeProvider>
                                <ReadingNoteProvider>
                                    <TagProvider>
                                        <ActionTrackProvider>
                                            <DiaryProvider>
                                                <ThemeProvider theme={theme}>
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDateFns}
                                                        dateFormats={{ keyboardDate: 'yyyy/MM/dd', normalDate: 'yyyy/MM/dd' }}
                                                    >
                                                        <Routes>
                                                            <Route path='/' element={<ActionTracks />} />
                                                            <Route path='/login' element={<Login />} />
                                                            <Route path='/ambitions' element={<Ambitions />} />
                                                            <Route path='/desired-states' element={<DesiredStates />} />
                                                            <Route path='/actions' element={<Actions />} />
                                                            <Route path='/memos' element={<Memos />} />
                                                            <Route path='/challenges' element={<Challenges />} />
                                                            <Route path='/reading-notes' element={<ReadingNotes />} />
                                                            <Route path='/action-tracks' element={<ActionTracks />} />
                                                            <Route path='/action-tracks/aggregations' element={<Aggregations />} />
                                                            <Route path='/diaries' element={<Diaries />} />
                                                        </Routes>
                                                    </LocalizationProvider>
                                                </ThemeProvider>
                                            </DiaryProvider>
                                        </ActionTrackProvider>
                                    </TagProvider>
                                </ReadingNoteProvider>
                            </ChallengeProvider>
                        </MemoProvider>
                    </ActionProvider>
                </DesiredStateProvider>
            </AmbitionProvider>
        </div>
    );
}

export default App;
