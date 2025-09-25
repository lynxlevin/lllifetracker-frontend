// MEMO: use `npm run production_local` to test this feature.
const useServiceWorker = () => {
    const getPushManager = async () => {
        if (!('Notification' in window)) return undefined;
        if (!('serviceWorker' in navigator)) return undefined;

        return await navigator.serviceWorker.ready.then(worker => {
            if (!worker.pushManager) return undefined;
            return worker.pushManager;
        });
    };

    // MYMEMO: Anything other than iOS or safari should be invalid
    const subscribeToWebPush = async () => {
        const pushManager = await getPushManager();
        if (pushManager === undefined) {
            alert('This Browser does not support Web Push.');
            return;
        }
        const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY;
        if (vapidPublicKey === undefined) {
            alert('VAPID_PUBLIC_KEY not set.');
            return;
        }

        switch (window.Notification.permission) {
            case 'default':
                const result = await window.Notification.requestPermission();
                if (result !== 'granted') {
                    alert('WebPush has been disabled. Try again.');
                    return;
                }
                break;
            case 'denied':
                alert('WebPush is blocked. Check your settings.');
                return;
            case 'granted':
                break;
        }

        console.log('before subscribe');
        const currentLocalSubscription = await pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: vapidPublicKey,
        });
        console.log('currentLocalSubscription', currentLocalSubscription);

        const subscriptionJSON = currentLocalSubscription.toJSON();
        console.log('before subscriptionJSON check', subscriptionJSON);
        if (!subscriptionJSON.endpoint || !subscriptionJSON.keys) {
            console.log('no endpoint or keys');
            alert('The issued token is not valid.');
            return;
        }

        // MYMEMO: access backend to store subscription.
        alert('WebPush is enabled now.');
    };

    const unsubscribeFromWebPush = async () => {
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

    const testNotification = () => {
        const title = 'testing push';
        const options = {
            body: 'body',
            icon: `${process.env.PUBLIC_URL}/favicon-96x96.png`,
            image: `${process.env.PUBLIC_URL}/favicon-96x96.png`,
            data: {
                url: process.env.PUBLIC_URL,
                message_id: 'test_id',
            },
        };
        navigator.serviceWorker.ready.then(async worker => {
            await worker.showNotification(title, options);
        });
    };

    return {
        getPushManager,
        subscribeToWebPush,
        unsubscribeFromWebPush,
        testNotification,
    };
};

export default useServiceWorker;
