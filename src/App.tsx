import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Login from './pages/Login';
import { AmbitionProvider } from './contexts/ambition-context';
import { DesiredStateProvider } from './contexts/desired-state-context';
import { ActionProvider } from './contexts/action-context';
import { amber, grey, red, teal, orange } from '@mui/material/colors';
import { TagProvider } from './contexts/tag-context';
import { ReadingNoteProvider } from './contexts/reading-note-context';
import ReadingNotes from './pages/Journal/ReadingNotes';
import { ActionTrackProvider } from './contexts/action-track-context';
import Aggregations from './pages/ActionTrackAggregations/Aggregations';
import { DiaryProvider } from './contexts/diary-context';
import Diaries from './pages/Journal/Diaries';
import TagSettings from './pages/Settings/TagSettings';
import MyWay from './pages/MyWay';
import { DesiredStateCategoryProvider } from './contexts/desired-state-category-context';
import DailyAggregations from './pages/ActionTrackAggregations/DailyAggregations';
import WeeklyAggregations from './pages/ActionTrackAggregations/WeeklyAggregations';

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
                        <DesiredStateCategoryProvider>
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
                                                        <Route path='/' element={<MyWay />} />
                                                        <Route path='/login' element={<Login />} />
                                                        <Route path='/reading-notes' element={<ReadingNotes />} />
                                                        <Route path='/aggregations' element={<Aggregations />} />
                                                        <Route path='/aggregations/daily' element={<DailyAggregations />} />
                                                        <Route path='/aggregations/weekly' element={<WeeklyAggregations />} />
                                                        <Route path='/diaries' element={<Diaries />} />
                                                        <Route path='/settings/tags' element={<TagSettings />} />
                                                    </Routes>
                                                </LocalizationProvider>
                                            </ThemeProvider>
                                        </DiaryProvider>
                                    </ActionTrackProvider>
                                </TagProvider>
                            </ReadingNoteProvider>
                        </DesiredStateCategoryProvider>
                    </ActionProvider>
                </DesiredStateProvider>
            </AmbitionProvider>
        </div>
    );
}

export default App;
