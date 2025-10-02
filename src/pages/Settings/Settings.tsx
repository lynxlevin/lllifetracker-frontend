import { Box, List, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
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
            <Box sx={{ pt: 4, color: 'rgba(0, 0, 0, 0.67)' }}>
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
        <ListItemButton
            sx={{ marginBottom: LIST_ITEM_MARGIN }}
            onClick={() => {
                navigate(path);
                window.scroll({ top: 0 });
            }}
        >
            <ListItemAvatar sx={{ lineHeight: '1em' }}>{icon}</ListItemAvatar>
            <ListItemText>{name}</ListItemText>
            <ChevronRightIcon />
        </ListItemButton>
    );
};

const ButtonListItem = ({ onClick, icon, name }: { onClick: () => void; icon: JSX.Element; name: string }) => {
    return (
        <ListItemButton sx={{ marginBottom: LIST_ITEM_MARGIN }} onClick={onClick}>
            <ListItemAvatar sx={{ lineHeight: '1em' }}>{icon}</ListItemAvatar>
            <ListItemText>{name}</ListItemText>
        </ListItemButton>
    );
};

export default Settings;
