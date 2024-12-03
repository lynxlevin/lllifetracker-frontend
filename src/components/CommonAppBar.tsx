import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import SyncIcon from '@mui/icons-material/Sync';
import HomeIcon from '@mui/icons-material/Home';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import {
    AppBar,
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Slide,
    Toolbar,
    useScrollTrigger,
} from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAmbitionContext from '../hooks/useAmbitionContext';
import useObjectiveContext from '../hooks/useObjectiveContext';
import useActionContext from '../hooks/useActionContext';

interface HideOnScrollProps {
    children: React.ReactElement;
}

const HideOnScroll = (props: HideOnScrollProps) => {
    const { children } = props;
    const trigger = useScrollTrigger({
        target: window,
    });

    return (
        <Slide appear={false} direction='down' in={!trigger}>
            {children}
        </Slide>
    );
};

interface CommonAppBarProps {
    handleLogout: () => Promise<void>;
}

const CommonAppBar = ({ handleLogout }: CommonAppBarProps) => {
    const [topBarDrawerOpen, setTopBarDrawerOpen] = useState(false);
    const navigate = useNavigate();

    const { getAmbitionsWithLinks } = useAmbitionContext();
    const { getObjectivesWithLinks, getObjectives } = useObjectiveContext();
    const { getActionsWithLinks, getActions } = useActionContext();

    const refresh = () => {
        getAmbitionsWithLinks();
        getObjectivesWithLinks();
        getObjectives();
        getActionsWithLinks();
        getActions();
    };

    return (
        <Container sx={{ mb: 10 }}>
            <HideOnScroll>
                <AppBar position='fixed' sx={{ bgcolor: 'primary.light' }}>
                    <Toolbar>
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
                                    <ListItemButton
                                        disableGutters
                                        onClick={() => {
                                            navigate('/');
                                            setTopBarDrawerOpen(false);
                                            window.scroll({ top: 0 });
                                        }}
                                    >
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
                </AppBar>
            </HideOnScroll>
        </Container>
    );
};
export default CommonAppBar;
