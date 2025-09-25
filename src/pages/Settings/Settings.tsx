import { Box, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import BasePage from '../../components/BasePage';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LabelIcon from '@mui/icons-material/Label';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import useUserContext from '../../hooks/useUserContext';
import { useNavigate } from 'react-router-dom';

const LIST_ITEM_MARGIN = 1.5;

const Settings = () => {
    const { handleLogout } = useUserContext();

    return (
        <BasePage pageName="Settings">
            <Box sx={{ pt: 4 }}>
                <List>
                    <NavigationListItem path={'/settings/tags'} icon={<LabelIcon />} name="タグ" />
                    <NavigationListItem path={'/settings/notifications'} icon={<NotificationsIcon />} name="通知" />
                    <ButtonListItem onClick={() => window.location.reload()} icon={<SecurityUpdateGoodIcon />} name="アプリリロード" />
                    <ButtonListItem onClick={handleLogout} icon={<LogoutIcon />} name="ログアウト" />
                </List>
            </Box>
        </BasePage>
    );
};

const NavigationListItem = ({ path, icon, name }: { path: string; icon: JSX.Element; name: string }) => {
    const navigate = useNavigate();
    return (
        <ListItem
            sx={{ marginBottom: LIST_ITEM_MARGIN }}
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={() => {
                        navigate(path);
                        window.scroll({ top: 0 });
                    }}
                >
                    <ChevronRightIcon />
                </IconButton>
            }
        >
            <ListItemAvatar>{icon}</ListItemAvatar>
            <ListItemText>{name}</ListItemText>
        </ListItem>
    );
};

const ButtonListItem = ({ onClick, icon, name }: { onClick: () => void; icon: JSX.Element; name: string }) => {
    return (
        <ListItemButton sx={{ marginBottom: LIST_ITEM_MARGIN }} onClick={onClick}>
            <ListItemAvatar>{icon}</ListItemAvatar>
            <ListItemText>{name}</ListItemText>
        </ListItemButton>
    );
};

export default Settings;
