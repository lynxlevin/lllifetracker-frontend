import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { AmbitionProvider } from './contexts/ambition-context';
import { DirectionProvider } from './contexts/direction-context';
import { ActionProvider } from './contexts/action-context';
import { amber, grey, red, teal, orange } from '@mui/material/colors';
import { TagProvider } from './contexts/tag-context';
import { ActionTrackProvider } from './contexts/action-track-context';
import { DirectionCategoryProvider } from './contexts/direction-category-context';
import { UserProvider } from './contexts/user-context';
import { JournalProvider } from './contexts/journal-context';
import { GlobalErrorProvider } from './contexts/global-error-context';
import AppRouter from './AppRouter';

declare module '@mui/material/styles' {
    interface Palette {
        ambitions: Palette['primary'];
        directions: Palette['primary'];
        actions: Palette['primary'];
    }
    interface PaletteOptions {
        ambitions?: PaletteOptions['primary'];
        directions?: PaletteOptions['primary'];
        actions?: PaletteOptions['primary'];
    }
}

const theme = createTheme({
    palette: {
        primary: orange,
        ambitions: red,
        directions: teal,
        actions: amber,
        background: { default: grey[200] },
    },
});

function App() {
    return (
        <div className="App">
            <UserProvider>
                <AmbitionProvider>
                    <DirectionProvider>
                        <ActionProvider>
                            <DirectionCategoryProvider>
                                <JournalProvider>
                                    <TagProvider>
                                        <ActionTrackProvider>
                                            <GlobalErrorProvider>
                                                <ThemeProvider theme={theme}>
                                                    <AppRouter />
                                                </ThemeProvider>
                                            </GlobalErrorProvider>
                                        </ActionTrackProvider>
                                    </TagProvider>
                                </JournalProvider>
                            </DirectionCategoryProvider>
                        </ActionProvider>
                    </DirectionProvider>
                </AmbitionProvider>
            </UserProvider>
        </div>
    );
}

export default App;
