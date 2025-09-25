import { Box, Button } from '@mui/material';
import BasePage from '../../components/BasePage';
import useServiceWorker from '../../hooks/useServiceWorker';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationSettings = () => {
    const [webPushSupported, setWebPushSupported] = useState<boolean>();
    const { getPushManager, subscribeToWebPush, testNotification, unsubscribeFromWebPush } = useServiceWorker();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (webPushSupported !== undefined) return;
            const res = await getPushManager();
            if (res !== undefined) setWebPushSupported(true);
        })();
    }, [getPushManager, webPushSupported]);
    return (
        <BasePage
            pageName="Settings"
            breadCrumbAction={() => {
                navigate('/settings');
                window.scroll({ top: 0 });
            }}
        >
            <Box sx={{ pt: 4 }}>
                <Button onClick={testNotification}>Send</Button>
                <Button onClick={subscribeToWebPush}>Subscribe</Button>
                <Button onClick={unsubscribeFromWebPush}>Unsubscribe</Button>
            </Box>
        </BasePage>
    );
};

export default NotificationSettings;
