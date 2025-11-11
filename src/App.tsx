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
import { ActionTrackProvider } from './contexts/action-track-context';
import Aggregations from './pages/ActionTrackAggregations/Aggregations';
import TagSettings from './pages/Settings/TagSettings';
import { DesiredStateCategoryProvider } from './contexts/desired-state-category-context';
import DailyAggregations from './pages/ActionTrackAggregations/DailyAggregations';
import WeeklyAggregations from './pages/ActionTrackAggregations/WeeklyAggregations';
import MonthlyAggregations from './pages/ActionTrackAggregations/MonthlyAggregations';
import { UserProvider } from './contexts/user-context';
import MyWay from './pages/MyWay';
import Actions from './pages/Actions';
import Settings from './pages/Settings/Settings';
import NotificationSettings from './pages/Settings/NotificationSettings';
import { JournalProvider } from './contexts/journal-context';
import Journals from './pages/Journal/Journals';

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
        <div className="App">
            <UserProvider>
                <AmbitionProvider>
                    <DesiredStateProvider>
                        <ActionProvider>
                            <DesiredStateCategoryProvider>
                                <JournalProvider>
                                    <TagProvider>
                                        <ActionTrackProvider>
                                            <ThemeProvider theme={theme}>
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDateFns}
                                                    dateFormats={{ keyboardDate: 'yyyy/MM/dd', normalDate: 'yyyy/MM/dd' }}
                                                >
                                                    <Routes>
                                                        <Route path="/" element={<MyWay />} />
                                                        <Route path="/login" element={<Login />} />
                                                        <Route path="/actions" element={<Actions />} />
                                                        <Route path="/aggregations" element={<Aggregations />} />
                                                        <Route path="/aggregations/daily" element={<DailyAggregations />} />
                                                        <Route path="/aggregations/weekly" element={<WeeklyAggregations />} />
                                                        <Route path="/aggregations/monthly" element={<MonthlyAggregations />} />
                                                        <Route path="/journals" element={<Journals />} />
                                                        <Route path="/settings" element={<Settings />} />
                                                        <Route path="/settings/tags" element={<TagSettings />} />
                                                        <Route path="/settings/notifications" element={<NotificationSettings />} />
                                                    </Routes>
                                                </LocalizationProvider>
                                            </ThemeProvider>
                                        </ActionTrackProvider>
                                    </TagProvider>
                                </JournalProvider>
                            </DesiredStateCategoryProvider>
                        </ActionProvider>
                    </DesiredStateProvider>
                </AmbitionProvider>
            </UserProvider>
        </div>
    );
}

export default App;
