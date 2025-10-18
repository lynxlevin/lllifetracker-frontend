import { Box, Button, Stack, TextField, Typography } from '@mui/material';
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
    const { getPushManager, subscribeToWebPush, unsubscribeFromWebPush } = useServiceWorker();
    const navigate = useNavigate();

    const resetAllStatus = () => {
        setWebPushSupported(undefined);
        setSubscriptionStatus(undefined);
        setSubscriptionFromServer(undefined);
    };

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
        switch (subscriptionStatus) {
            case 'FrontOnly':
                unsubscribeFromWebPush()
                    .then(_ => setSubscriptionStatus('NoSub'))
                    .catch(e => {
                        alert(e);
                    });
                return;
            case 'BackOnly':
                WebPushSubscriptionAPI.delete()
                    .then(_ => {
                        alert('unsubscribed from subscription.');
                        setSubscriptionFromServer(null);
                        setSubscriptionStatus('NoSub');
                    })
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
        }
    };

    const trySendNotification = () => {
        WebPushSubscriptionAPI.send().then(res => {
            if (res.status === 410 || res.status === 404) resetAllStatus();
        });
    };

    const getSubscriptionStatusView = () => {
        switch (subscriptionStatus) {
            case 'NoSub':
                return (
                    <>
                        {deviceName !== undefined && (
                            <TextField defaultValue={deviceName} onBlur={event => setDeviceName(event.target.value)} label="デバイス名" fullWidth />
                        )}
                        <Button onClick={subscribe}>プッシュ通知に登録</Button>
                    </>
                );
            case 'FrontOnly':
                return (
                    <>
                        <Typography textAlign="left">
                            プッシュ通知の登録がサーバーとうまく連携できていません。一旦登録を解除し、再度登録し直してください。
                        </Typography>
                        <Button onClick={unsubscribe}>登録解除</Button>
                    </>
                );
            case 'BackOnly':
                return (
                    <Stack>
                        <Typography>別のデバイスでプッシュ通知登録ずみ</Typography>
                        <Typography>登録中のデバイス名: {subscriptionFromServer!.device_name}</Typography>
                        <Button onClick={trySendNotification}>試しに通知を送る</Button>
                        <Button color="error" onClick={unsubscribe}>
                            ForceUnsubscribe
                        </Button>
                    </Stack>
                );
            case 'Subscribed':
                return (
                    <Stack>
                        <Typography>プッシュ通知登録ずみ</Typography>
                        <Typography>登録中のデバイス名: {subscriptionFromServer!.device_name}</Typography>
                        {subscriptionFromServer!.expiration_epoch_time !== null && (
                            <Typography>通知の有効期間: {new Date(subscriptionFromServer!.expiration_epoch_time).toLocaleString()}</Typography>
                        )}
                        <Button onClick={trySendNotification}>試しに通知を送る</Button>
                        <Button color="error" onClick={unsubscribe}>
                            プッシュ通知を解除
                        </Button>
                    </Stack>
                );
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
            <Box sx={{ pt: 4 }}>{getSubscriptionStatusView()}</Box>
        </BasePage>
    );
};

export default NotificationSettings;
