import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import Login from './pages/Login';
import { AmbitionProvider } from './contexts/ambition-context';
import Ambitions from './pages/Ambitions';
import { ObjectiveProvider } from './contexts/objective-context';
import { ActionProvider } from './contexts/action-context';
import { amber, grey, red, teal, orange } from '@mui/material/colors';
import Objectives from './pages/Objectives';
import Actions from './pages/Actions';
import { MemoProvider } from './contexts/memo-context';
import Memos from './pages/Memos';
import { TagProvider } from './contexts/tag-context';
import { MissionMemoProvider } from './contexts/mission-memo-context';
import MissionMemos from './pages/MissionMemos';
import { BookExcerptProvider } from './contexts/book-excerpt-context';
import BookExcerpts from './pages/BookExcerpts';
import { ActionTrackProvider } from './contexts/action-track-context';
import ActionTracks from './pages/ActionTracks';
import Aggregations from './pages/ActionTracks/Aggregations';

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
        primary: orange,
        ambitions: red,
        objectives: teal,
        actions: amber,
        background: { default: grey[100] },
    },
});

function App() {
    return (
        <div className='App'>
            <AmbitionProvider>
                <ObjectiveProvider>
                    <ActionProvider>
                        <MemoProvider>
                            <MissionMemoProvider>
                                <BookExcerptProvider>
                                    <TagProvider>
                                        <ActionTrackProvider>
                                            <ThemeProvider theme={theme}>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDateFns}
                                                    dateFormats={{ keyboardDate: 'yyyy/MM/dd', normalDate: 'yyyy/MM/dd' }}
                                                >
                                                    <Routes>
                                                        <Route path='/' element={<ActionTracks />} />
                                                        <Route path='/login' element={<Login />} />
                                                        <Route path='/ambitions' element={<Ambitions />} />
                                                        <Route path='/objectives' element={<Objectives />} />
                                                        <Route path='/actions' element={<Actions />} />
                                                        <Route path='/memos' element={<Memos />} />
                                                        <Route path='/mission-memos' element={<MissionMemos />} />
                                                        <Route path='/book-excerpts' element={<BookExcerpts />} />
                                                        <Route path='/action-tracks' element={<ActionTracks />} />
                                                        <Route path='/action-tracks/aggregations' element={<Aggregations />} />
                                                    </Routes>
                                                </LocalizationProvider>
                                            </ThemeProvider>
                                        </ActionTrackProvider>
                                    </TagProvider>
                                </BookExcerptProvider>
                            </MissionMemoProvider>
                        </MemoProvider>
                    </ActionProvider>
                </ObjectiveProvider>
            </AmbitionProvider>
        </div>
    );
}

export default App;
