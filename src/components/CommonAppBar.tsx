import SyncIcon from '@mui/icons-material/Sync';
import { AppBar, Container, IconButton, Toolbar } from '@mui/material';
import useAmbitionContext from '../hooks/useAmbitionContext';
import useDesiredStateContext from '../hooks/useDesiredStateContext';
import useReadingNoteContext from '../hooks/useReadingNoteContext';
import useActionContext from '../hooks/useActionContext';
import useTagContext from '../hooks/useTagContext';
import useActionTrackContext from '../hooks/useActionTrackContext';
import useDiaryContext from '../hooks/useDiaryContext';
import useUserContext from '../hooks/useUserContext';
import useThinkingNoteContext from '../hooks/useThinkingNoteContext';

const CommonAppBar = () => {
    const { clearAmbitionsCache } = useAmbitionContext();
    const { clearDesiredStatesCache } = useDesiredStateContext();
    const { clearActionsCache } = useActionContext();
    const { clearDiariesCache } = useDiaryContext();
    const { clearReadingNotesCache } = useReadingNoteContext();
    const { clearThinkingNotesCache } = useThinkingNoteContext();
    const { clearTagsCache } = useTagContext();
    const { clearActionTracksCache, clearAggregationCache } = useActionTrackContext();
    const { clearUserCache } = useUserContext();

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.0');

    const refresh = () => {
        clearActionsCache();
        clearActionTracksCache();
        clearAggregationCache();
        clearAmbitionsCache();
        clearDesiredStatesCache();
        clearDiariesCache();
        clearReadingNotesCache();
        clearThinkingNotesCache();
        clearTagsCache();
        clearUserCache();
    };

    return (
        <Container sx={{ mb: 4 }}>
            <AppBar position="fixed" sx={{ bgcolor: 'primary.light' }} elevation={0}>
                <Toolbar variant="dense">
                    {isLocal && 'Local'}
                    <div style={{ flexGrow: 1 }} />
                    <IconButton onClick={refresh}>
                        <SyncIcon sx={{ color: 'rgba(0,0,0,0.67)' }} />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Container>
    );
};
export default CommonAppBar;
