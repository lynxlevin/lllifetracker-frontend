import { Box, Button, TextField, Typography } from '@mui/material';
import BasePage from '../../components/BasePage';
import useServiceWorker from '../../hooks/useServiceWorker';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebPushSubscriptionFromServer } from '../../types/notification';
import { WebPushSubscriptionAPI } from '../../apis/WebPushSubscriptionAPI';

type SubscriptionStatus = 'NoSub' | 'FrontOnly' | 'BackOnly' | 'Subscribed';

const NotificationSettings = () => {
    const [deviceName, setDeviceName] = useState<string>();
    const [webPushSupported, setWebPushSupported] = useState<boolean>();
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>();
    const [subscriptionFromServer, setSubscriptionFromServer] = useState<WebPushSubscriptionFromServer | null>();
    const { getPushManager, subscribeToWebPush, testNotification, unsubscribeFromWebPush } = useServiceWorker();
    const navigate = useNavigate();

    const subscribe = () => {
        if (subscriptionStatus !== 'NoSub') return;
        subscribeToWebPush()
            .then(subscription => {
                if (!subscription.endpoint || !subscription.keys) {
                    alert('The issued token is not valid.');
                    return;
                }
                WebPushSubscriptionAPI.create({
                    device_name: deviceName ?? '',
                    endpoint: subscription.endpoint,
                    expiration_epoch_time: subscription.expirationTime ?? null,
                    p256dh_key: subscription.keys.p256dh,
                    auth_key: subscription.keys.auth,
                })
                    .then(_ => {
                        alert('WebPush is enabled now.');
                        setSubscriptionFromServer({ device_name: deviceName ?? '', expiration_epoch_time: subscription.expirationTime ?? null });
                        setSubscriptionStatus('Subscribed');
                    })
                    .catch(e => {
                        alert(e);
                        unsubscribeFromWebPush()
                            .then(_ => {
                                alert('Something happened. Try again.');
                                setSubscriptionStatus('NoSub');
                            })
                            .catch(e => {
                                alert(e);
                                setSubscriptionStatus('FrontOnly');
                            });
                    });
            })
            .catch(e => {
                alert(e);
            });
    };

    const unsubscribe = () => {
        if (['NoSub', 'BackOnly', undefined].includes(subscriptionStatus)) return;
        switch (subscriptionStatus) {
            case 'FrontOnly':
                unsubscribeFromWebPush()
                    .then(_ => setSubscriptionStatus('NoSub'))
                    .catch(e => {
                        alert(e);
                    });
                return;
            case 'Subscribed':
                unsubscribeFromWebPush()
                    .then(_ => {
                        WebPushSubscriptionAPI.delete()
                            .then(_ => {
                                alert('unsubscribed from subscription.');
                                setSubscriptionFromServer(null);
                                setSubscriptionStatus('NoSub');
                            })
                            .catch(e => {
                                alert(e);
                                setSubscriptionStatus('BackOnly');
                            });
                    })
                    .catch(e => {
                        alert(e);
                    });
                return;
            default:
                return;
        }
    };

    useEffect(() => {
        if (subscriptionStatus !== undefined || subscriptionFromServer !== undefined || webPushSupported !== undefined) return;
        (async () => {
            const pushManager = await getPushManager();
            let subInDevice: boolean;
            setWebPushSupported(pushManager !== undefined);
            if (pushManager !== undefined) {
                const subscription = await pushManager.getSubscription();
                subInDevice = !!subscription;
            } else {
                subInDevice = false;
            }

            WebPushSubscriptionAPI.list()
                .then(res => {
                    setSubscriptionFromServer(res.data);
                    if (res.data !== null) {
                        subInDevice ? setSubscriptionStatus('Subscribed') : setSubscriptionStatus('BackOnly');
                    } else {
                        subInDevice ? setSubscriptionStatus('FrontOnly') : setSubscriptionStatus('NoSub');
                    }
                })
                .catch(e => {
                    alert(e);
                    subInDevice ? setSubscriptionStatus('FrontOnly') : setSubscriptionStatus('NoSub');
                });
        })();
    }, [getPushManager, subscriptionFromServer, subscriptionStatus, webPushSupported]);
    useEffect(() => {
        const uaRegex = {
            Android: /Android/i,
            'Chrome OS': /CrOS/i,
            iPad: /iPad/i,
            iPhone: /iPhone/i,
            macOS: /Macintosh/i,
            Windows: /IEMobile|Windows/i,
        };
        let match = Object.entries(uaRegex).find(([k, v]) => navigator.userAgent.match(v));
        setDeviceName(match === undefined ? '' : match[0]);
    }, []);
    return (
        <BasePage
            pageName="Settings"
            breadCrumbAction={() => {
                navigate('/settings');
                window.scroll({ top: 0 });
            }}
        >
            <Box sx={{ pt: 4 }}>
                {deviceName !== undefined && subscriptionStatus === 'NoSub' && (
                    <TextField defaultValue={deviceName} onBlur={event => setDeviceName(event.target.value)} label="デバイス名" fullWidth />
                )}
                {subscriptionStatus === 'Subscribed' && <Button onClick={testNotification}>Send</Button>}
                <Button onClick={subscribe} disabled={subscriptionStatus !== 'NoSub' || !webPushSupported}>
                    Subscribe
                </Button>
                <Button onClick={unsubscribe} disabled={['NoSub', 'BackOnly', undefined].includes(subscriptionStatus) && webPushSupported}>
                    Unsubscribe
                </Button>
                {subscriptionFromServer !== undefined && (
                    <Box>
                        <Typography>現在のサーバーの登録: {subscriptionFromServer === null ? '通知登録なし' : '通知登録あり'}</Typography>
                        {subscriptionFromServer !== null && (
                            <>
                                <Typography>登録されているデバイス名: {subscriptionFromServer.device_name}</Typography>
                                {subscriptionFromServer.expiration_epoch_time !== null && (
                                    <Typography>通知の有効期間: {new Date(subscriptionFromServer.expiration_epoch_time).toLocaleString()}</Typography>
                                )}
                            </>
                        )}
                    </Box>
                )}
                <Box>
                    {subscriptionStatus}
                    <Typography>
                        デバイス上の通知設定: {['NoSub', 'BackOnly', undefined].includes(subscriptionStatus) ? '通知登録なし' : '通知登録あり'}
                    </Typography>
                </Box>
            </Box>
        </BasePage>
    );
};

export default NotificationSettings;
