import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SyncIcon from '@mui/icons-material/Sync';
import HomeIcon from '@mui/icons-material/Home';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import { AppBar, Container, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import type React from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAmbitionContext from '../hooks/useAmbitionContext';
import useObjectiveContext from '../hooks/useObjectiveContext';
import useActionContext from '../hooks/useActionContext';
import useMemoContext from '../hooks/useMemoContext';
import useTagContext from '../hooks/useTagContext';
import useMissionMemoContext from '../hooks/useMissionMemoContext';
import type { PageName } from './BasePage';
import CommonTabBar from './CommonTabBar';
import useActionTrackContext from '../hooks/useActionTrackContext';

interface CommonAppBarProps {
    handleLogout: () => void;
    pageName: PageName;
}

const CommonAppBar = ({ handleLogout, pageName }: CommonAppBarProps) => {
    const [topBarDrawerOpen, setTopBarDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const { getAmbitionsWithLinks } = useAmbitionContext();
    const { getObjectivesWithLinks, getObjectives } = useObjectiveContext();
    const { getActionsWithLinks, getActions } = useActionContext();
    const { getMemos } = useMemoContext();
    const { getMissionMemos } = useMissionMemoContext();
    const { getTags } = useTagContext();
    const { getActionTracks } = useActionTrackContext();

    const refresh = () => {
        getAmbitionsWithLinks();
        getObjectivesWithLinks();
        getObjectives();
        getActionsWithLinks();
        getActions();
        getMemos();
        getMissionMemos();
        getTags();
        getActionTracks();
    };

    const restDay = () => {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        localStorage.setItem('rest_day_start_utc', today.toISOString());
        window.location.reload();
    };

    const tabNames = useMemo(() => {
        if (pageName === 'Ambitions')
            return [
                { name: '/ambitions', label: '大望' },
                { name: '/objectives', label: '目標' },
                { name: '/actions', label: '行動' },
            ];
        if (pageName === 'Memos')
            return [
                { name: '/memos', label: 'メモ' },
                { name: '/mission-memos', label: '課題' },
                { name: '/book-excerpts', label: '本の抜粋' },
            ];
        if (pageName === 'ActionTracks')
            return [
                { name: '/action-tracks', label: '計測' },
                { name: '/action-tracks/aggregations', label: '集計' },
            ];
        return [];
    }, [pageName]);

    return (
        <Container sx={{ mb: 10 }}>
            <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }} elevation={0}>
                <Toolbar variant='dense'>
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
                                <ListItemButton
                                    disableGutters
                                    onClick={() => {
                                        navigate('/');
                                        setTopBarDrawerOpen(false);
                                        window.scroll({ top: 0 });
                                    }}
                                >
                                    <ListItemIcon>
                                        <HomeIcon />
                                    </ListItemIcon>
                                    <ListItemText>Home</ListItemText>
                                </ListItemButton>
                            </ListItem>
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
                {tabNames.length > 0 && <CommonTabBar tabNames={tabNames} />}
            </AppBar>
        </Container>
    );
};
export default CommonAppBar;
