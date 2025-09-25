import { Box, Button, Divider } from '@mui/material';
import BasePage from '../../components/BasePage';
import DesiredStatesSectionV2 from './DesiredStatesSectionV2';
import AmbitionsSectionV2 from './AmbitionsSectionV2';
import useServiceWorker from '../../hooks/useServiceWorker';
import { useEffect, useState } from 'react';

const MyWay = () => {
    const [webPushSupported, setWebPushSupported] = useState<boolean>();
    const { getPushManager, subscribeToWebPush, testNotification } = useServiceWorker();

    const unregisterSubscription = async () => {
        const pushManager = await getPushManager();
        if (pushManager === undefined) {
            alert('pushManager undefined');
            return;
        }
        pushManager.getSubscription().then(subscription => {
            if (!subscription) {
                alert('no active subscription');
                return;
            }
            subscription
                .unsubscribe()
                .then(() => {
                    alert('unsubscribed from subscription.');
                    return;
                })
                .catch(e => {
                    alert(e);
                    return;
                });
        });
    };

    useEffect(() => {
        (async () => {
            if (webPushSupported !== undefined) return;
            const res = await getPushManager();
            if (res !== undefined) setWebPushSupported(true);
        })();
    }, [getPushManager, webPushSupported]);
    return (
        <BasePage pageName="MyWay">
            <Box sx={{ pt: 4 }}>
                {webPushSupported && (
                    <>
                        <Button onClick={testNotification}>Send</Button>
                        <Button onClick={subscribeToWebPush}>Subscribe</Button>
                        <Button onClick={unregisterSubscription}>UnregisterSubscribe</Button>
                    </>
                )}
                <AmbitionsSectionV2 />
                <Divider color="#ccc" sx={{ my: 1 }} />
                <DesiredStatesSectionV2 />
            </Box>
        </BasePage>
    );
};

export default MyWay;
