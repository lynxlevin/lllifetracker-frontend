import { UserAPI } from '../apis/UserAPI';
import type { AxiosError } from 'axios';
import useAmbitionContext from './useAmbitionContext';
import useDesiredStateContext from './useDesiredStateContext';
import useActionContext from './useActionContext';
import useTagContext from './useTagContext';
import useActionTrackContext from './useActionTrackContext';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SetUserContext, UserContext } from '../contexts/user-context';
import useJournalContext from './useJournalContext';

const useUserContext = () => {
    const userContext = useContext(UserContext);
    const setUserContext = useContext(SetUserContext);

    const navigate = useNavigate();
    const { clearActionsCache } = useActionContext();
    const { clearActionTracksCache, clearAggregationCache } = useActionTrackContext();
    const { clearAmbitionsCache } = useAmbitionContext();
    const { clearDesiredStatesCache } = useDesiredStateContext();
    const { clearTagsCache } = useTagContext();
    const { clearJournalsCache } = useJournalContext();

    const user = userContext.user;
    const clearUserCache = () => {
        setUserContext.setUser(undefined);
    };
    const getUser = () => {
        UserAPI.me()
            .then(res => {
                setUserContext.setUser(res.data);
            })
            .catch(e => console.error(e));
    };

    const NOT_LOGGED_IN_ERROR = 'We currently have some issues. Kindly try again and ensure you are logged in.';

    const handleLogout = () => {
        UserAPI.logout()
            .then(_ => {
                clearActionsCache();
                clearActionTracksCache();
                clearAggregationCache();
                clearAmbitionsCache();
                clearDesiredStatesCache();
                clearJournalsCache();
                clearTagsCache();
                clearUserCache();
                navigate('/login');
            })
            .catch((e: AxiosError<{ error: string }>) => {
                if (e.status === 400 && e.response?.data.error === NOT_LOGGED_IN_ERROR) {
                    return;
                }
            });
    };

    return {
        user,
        clearUserCache,
        getUser,
        handleLogout,
    };
};

export default useUserContext;
