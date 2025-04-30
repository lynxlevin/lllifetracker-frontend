import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SyncIcon from '@mui/icons-material/Sync';
import SettingsIcon from '@mui/icons-material/Settings';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import { AppBar, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAmbitionContext from '../hooks/useAmbitionContext';
import useDesiredStateContext from '../hooks/useDesiredStateContext';
import useReadingNoteContext from '../hooks/useReadingNoteContext';
import useActionContext from '../hooks/useActionContext';
import useTagContext from '../hooks/useTagContext';
import useActionTrackContext from '../hooks/useActionTrackContext';
import useMindsetContext from '../hooks/useMindsetContext';
import { startOfDay } from 'date-fns';

interface CommonAppBarProps {
    handleLogout: () => void;
}

const CommonAppBar = ({ handleLogout }: CommonAppBarProps) => {
    const [topBarDrawerOpen, setTopBarDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const { getAmbitions } = useAmbitionContext();
    const { getDesiredStates } = useDesiredStateContext();
    const { getActions } = useActionContext();
    const { getReadingNotes } = useReadingNoteContext();
    const { getTags } = useTagContext();
    const { getActionTracks } = useActionTrackContext();
    const { getMindsets } = useMindsetContext();

    const isLocal = window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.0');

    const refresh = () => {
        getAmbitions();
        getDesiredStates();
        getActions();
        getReadingNotes();
        getTags();
        getActionTracks();
        getMindsets();
    };

    const restDay = () => {
        localStorage.setItem('rest_day_start_utc', startOfDay(new Date()).toISOString());
        window.location.reload();
    };

    return (
        <Container sx={{ mb: 4 }}>
            <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                <Toolbar variant='dense'>
                    {isLocal && 'Local'}
                    <div style={{ flexGrow: 1 }} />
                    <IconButton onClick={refresh}>
                        <SyncIcon sx={{ color: 'rgba(0,0,0,0.67)' }} />
                    </IconButton>
                    <IconButton onClick={() => setTopBarDrawerOpen(true)}>
                        <MenuIcon sx={{ color: 'rgba(0,0,0,0.67)' }} />
                    </IconButton>
                    <Drawer anchor='right' open={topBarDrawerOpen} onClose={() => setTopBarDrawerOpen(false)}>
                        <List>
                            <ListItem>
                                <ListItemButton disableGutters onClick={restDay}>
                                    <ListItemIcon>
                                        <BakeryDiningIcon />
                                    </ListItemIcon>
                                    <ListItemText>今日は休む</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    disableGutters
                                    onClick={() => {
                                        navigate('/settings/tags');
                                        setTopBarDrawerOpen(false);
                                        window.scroll({ top: 0 });
                                    }}
                                >
                                    <ListItemIcon>
                                        <SettingsIcon />
                                    </ListItemIcon>
                                    <ListItemText>設定</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton
                                    disableGutters
                                    onClick={() => {
                                        window.location.reload();
                                    }}
                                >
                                    <ListItemIcon>
                                        <SecurityUpdateGoodIcon />
                                    </ListItemIcon>
                                    <ListItemText>Refresh App</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            <ListItem>
                                <ListItemButton disableGutters onClick={handleLogout}>
                                    <ListItemIcon>
                                        <LogoutIcon />
                                    </ListItemIcon>
                                    <ListItemText>Logout</ListItemText>
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Drawer>
                </Toolbar>
            </AppBar>
        </Container>
    );
};
export default CommonAppBar;
