import {
    Box,
    Button,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import BasePage from '../../components/BasePage';
import useServiceWorker from '../../hooks/useServiceWorker';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WebPushSubscriptionFromServer, RecurrenceType } from '../../types/notification';
import { WebPushSubscriptionAPI } from '../../apis/WebPushSubscriptionAPI';
import type { NotificationRule, NotificationRuleType } from '../../types/notification';
import { NotificationRuleAPI } from '../../apis/NotificationRuleAPI';

type SubscriptionStatus = 'NoSub' | 'FrontOnly' | 'BackOnly' | 'Subscribed';

const NotificationSettings = () => {
    const [deviceName, setDeviceName] = useState<string>();
    const [webPushSupported, setWebPushSupported] = useState<boolean>();
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>();
    const [subscriptionFromServer, setSubscriptionFromServer] = useState<WebPushSubscriptionFromServer | null>();
    const [notificationRules, setNotificationRules] = useState<NotificationRule[]>();
    const [creatingNotificationRule, setCreatingNotificationRule] = useState(false);
    const { getPushManager, subscribeToWebPush, unsubscribeFromWebPush } = useServiceWorker();
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

    const getSubscriptionStatusView = () => {
        switch (subscriptionStatus) {
            case undefined:
                return <Typography>プッシュ通知の登録を確認中です。</Typography>;
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
                        <Button color="error" onClick={unsubscribe}>
                            プッシュ通知を解除
                        </Button>
                    </Stack>
                );
        }
    };

    const refreshNotificationRules = () => {
        setCreatingNotificationRule(false);
        NotificationRuleAPI.list().then(res => {
            setNotificationRules(res.data);
        });
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
        if (notificationRules !== undefined) return;
        refreshNotificationRules();
    }, [notificationRules]);
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
            <Box pt={4}>
                {getSubscriptionStatusView()}
                <Divider />
                <Box pt={2}>
                    <Stack direction="row" justifyContent="space-between" pb={1}>
                        <Typography variant="h6">通知設定</Typography>
                    </Stack>
                    <Typography fontSize="1.1rem" sx={{ textShadow: 'lightgrey 0.4px 0.4px 0.5px' }}>
                        我が道
                    </Typography>
                    <Button onClick={() => setCreatingNotificationRule(true)} disabled={creatingNotificationRule || notificationRules?.length === 3}>
                        新規登録
                    </Button>
                    {creatingNotificationRule && (
                        <NotificationRuleCard refresh={refreshNotificationRules} usedTypes={notificationRules?.map(notification => notification.type) ?? []} />
                    )}
                    {notificationRules?.map(notification => (
                        <NotificationRuleCard
                            notification={notification}
                            key={notification.type}
                            refresh={refreshNotificationRules}
                            usedTypes={notificationRules?.map(notification => notification.type) ?? []}
                        />
                    ))}
                </Box>
            </Box>
        </BasePage>
    );
};

const NotificationRuleCard = ({
    notification,
    refresh,
    usedTypes,
}: {
    notification?: NotificationRule;
    refresh: () => void;
    usedTypes: NotificationRuleType[];
}) => {
    const unusedTypes = (['AmbitionOrDirection', 'Ambition', 'Direction'] as NotificationRuleType[]).filter(type => !usedTypes.includes(type));

    const [notificationType, setNotificationType] = useState<NotificationRuleType>(notification?.type ?? unusedTypes[0]);
    const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>(notification?.recurrence_type ?? 'Everyday');
    const [hour, setHour] = useState<string>(notification !== undefined ? notification.time.split(':')[0] : String(new Date().getHours()));
    const [minute, setMinute] = useState<string>(notification !== undefined ? notification.time.split(':')[1] : '00');

    const getTargetText = (type: NotificationRuleType) => {
        switch (type) {
            case 'AmbitionOrDirection':
                return '大志/指針';
            case 'Ambition':
                return '大志';
            case 'Direction':
                return '指針';
        }
    };

    const getTimeText = () => {
        let weekdayName;
        switch (recurrenceType) {
            case 'Everyday':
                weekdayName = '毎日';
                break;
            case 'Weekday':
                weekdayName = '月〜金の';
                break;
            case 'Weekend':
                weekdayName = '土日の';
                break;
        }
        return `${weekdayName} ${hour}:${minute}`;
    };

    const onSave = () => {
        NotificationRuleAPI.create({ type: notificationType, recurrence_type: recurrenceType, time: `${hour}:${minute}:00` }).then(_ => refresh());
    };

    return (
        <Paper sx={{ p: 2, mt: 1, textAlign: 'left' }}>
            <Stack direction="row" justifyContent="end">
                <Stack direction="row">
                    {notification !== undefined && (
                        <IconButton
                            size="small"
                            onClick={() => {
                                NotificationRuleAPI.delete(notification.type).then(_ => refresh());
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    )}
                </Stack>
            </Stack>
            {notification === undefined ? (
                <>
                    <FormControl size="small">
                        <Stack direction="row" alignItems="center">
                            <InputLabel id="notification-type-label" sx={{ mr: 1 }}>
                                種類
                            </InputLabel>
                            <Select
                                defaultValue={unusedTypes[0]}
                                onChange={(event: SelectChangeEvent) => {
                                    setNotificationType(event.target.value as NotificationRuleType);
                                }}
                                labelId="notification-type-label"
                            >
                                {unusedTypes.map(type => {
                                    return (
                                        <MenuItem value={type} key={type}>
                                            {getTargetText(type)}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                            <Typography ml={1}>からランダムに</Typography>
                        </Stack>
                    </FormControl>
                    <Stack direction="row" alignItems="center">
                        <Select
                            value={recurrenceType}
                            onChange={(event: SelectChangeEvent) => {
                                setRecurrenceType(event.target.value as RecurrenceType);
                            }}
                            size="small"
                            sx={{ mr: 1 }}
                        >
                            <MenuItem value="Everyday">毎日</MenuItem>
                            <MenuItem value="Weekday">月〜金の</MenuItem>
                            <MenuItem value="Weekend">土日の</MenuItem>
                        </Select>
                        <Select
                            value={hour}
                            onChange={(event: SelectChangeEvent) => {
                                setHour(event.target.value);
                            }}
                            size="small"
                            sx={{ mr: 1 }}
                        >
                            <MenuItem value="00">00</MenuItem>
                            <MenuItem value="01">01</MenuItem>
                            <MenuItem value="02">02</MenuItem>
                            <MenuItem value="03">03</MenuItem>
                            <MenuItem value="04">04</MenuItem>
                            <MenuItem value="05">05</MenuItem>
                            <MenuItem value="06">06</MenuItem>
                            <MenuItem value="07">07</MenuItem>
                            <MenuItem value="08">08</MenuItem>
                            <MenuItem value="09">09</MenuItem>
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="11">11</MenuItem>
                            <MenuItem value="12">12</MenuItem>
                            <MenuItem value="13">13</MenuItem>
                            <MenuItem value="14">14</MenuItem>
                            <MenuItem value="15">15</MenuItem>
                            <MenuItem value="16">16</MenuItem>
                            <MenuItem value="17">17</MenuItem>
                            <MenuItem value="18">18</MenuItem>
                            <MenuItem value="19">19</MenuItem>
                            <MenuItem value="20">20</MenuItem>
                            <MenuItem value="21">21</MenuItem>
                            <MenuItem value="22">22</MenuItem>
                            <MenuItem value="23">23</MenuItem>
                        </Select>
                        <Typography>:</Typography>
                        <Select
                            value={minute}
                            onChange={(event: SelectChangeEvent) => {
                                setMinute(event.target.value);
                            }}
                            size="small"
                            sx={{ ml: 1 }}
                        >
                            <MenuItem value="00">00</MenuItem>
                            <MenuItem value="10">10</MenuItem>
                            <MenuItem value="20">20</MenuItem>
                            <MenuItem value="30">30</MenuItem>
                            <MenuItem value="40">40</MenuItem>
                            <MenuItem value="50">50</MenuItem>
                        </Select>
                        <Button onClick={onSave}>登録する</Button>
                    </Stack>
                </>
            ) : (
                <Box ml={1} mt={1}>
                    {notification === undefined ? (
                        <Typography>設定なし</Typography>
                    ) : (
                        <>
                            <Typography>対象: {getTargetText(notificationType)} からランダムに</Typography>
                            <Typography>時間: {getTimeText()}</Typography>
                        </>
                    )}
                </Box>
            )}
        </Paper>
    );
};

export default NotificationSettings;
