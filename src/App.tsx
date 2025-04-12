import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Login from './pages/Login';
import { AmbitionProvider } from './contexts/ambition-context';
import { DesiredStateProvider } from './contexts/desired-state-context';
import { ActionProvider } from './contexts/action-context';
import { amber, grey, red, teal, orange } from '@mui/material/colors';
import { TagProvider } from './contexts/tag-context';
import { ReadingNoteProvider } from './contexts/reading-note-context';
import ReadingNotes from './pages/Journal/ReadingNotes';
import { ActionTrackProvider } from './contexts/action-track-context';
import Aggregations from './pages/ActionTrackAggregations';
import { DiaryProvider } from './contexts/diary-context';
import Diaries from './pages/Journal/Diaries';
import Home from './pages/Home';

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
                                                    <Route path='/' element={<Home />} />
                                                    <Route path='/login' element={<Login />} />
                                                    <Route path='/reading-notes' element={<ReadingNotes />} />
                                                    <Route path='/action-tracks/aggregations' element={<Aggregations />} />
                                                    <Route path='/diaries' element={<Diaries />} />
                                                </Routes>
                                            </LocalizationProvider>
                                        </ThemeProvider>
                                    </DiaryProvider>
                                </ActionTrackProvider>
                            </TagProvider>
                        </ReadingNoteProvider>
                    </ActionProvider>
                </DesiredStateProvider>
            </AmbitionProvider>
        </div>
    );
}

export default App;
