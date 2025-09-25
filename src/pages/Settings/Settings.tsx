import { Box, Button } from '@mui/material';
import BasePage from '../../components/BasePage';
import useServiceWorker from '../../hooks/useServiceWorker';
import { useEffect, useState } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityUpdateGoodIcon from '@mui/icons-material/SecurityUpdateGood';
import useUserContext from '../../hooks/useUserContext';

const Settings = () => {
    const [webPushSupported, setWebPushSupported] = useState<boolean>();
    const { getPushManager, subscribeToWebPush, testNotification, unsubscribeFromWebPush } = useServiceWorker();
    const { handleLogout } = useUserContext();

    useEffect(() => {
        (async () => {
            if (webPushSupported !== undefined) return;
            const res = await getPushManager();
            if (res !== undefined) setWebPushSupported(true);
        })();
    }, [getPushManager, webPushSupported]);
    return (
        <BasePage pageName="Settings">
            <Box sx={{ pt: 4 }}>
                <>
                    <Button onClick={testNotification}>Send</Button>
                    <Button onClick={subscribeToWebPush}>Subscribe</Button>
                    <Button onClick={unsubscribeFromWebPush}>Unsubscribe</Button>
                </>
                <Button
                    onClick={() => {
                        window.location.reload();
                    }}
                >
                    <SecurityUpdateGoodIcon />
                    Refresh App
                </Button>
                <Button onClick={handleLogout}>
                    <LogoutIcon />
                    Logout
                </Button>
            </Box>
        </BasePage>
    );
};

export default Settings;
