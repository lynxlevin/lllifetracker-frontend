import { useContext } from 'react';
import { UserAPI } from '../apis/UserAPI';
import { UserContext } from '../contexts/user-context';
import type { AxiosError } from 'axios';
import useAmbitionContext from './useAmbitionContext';
import useObjectiveContext from './useObjectiveContext';
import useActionContext from './useActionContext';

const useUserAPI = () => {
    const userContext = useContext(UserContext);
    const { clearAmbitionsCache } = useAmbitionContext();
    const { clearObjectivesCache } = useObjectiveContext();
    const { clearActionsCache } = useActionContext();

    const NOT_LOGGED_IN_ERROR = 'We currently have some issues. Kindly try again and ensure you are logged in.';

    const updateLoginStatus = () => {
        UserAPI.me()
            .then(() => {
                userContext.setIsLoggedIn(true);
            })
            .catch((_: AxiosError<{ error: string }>) => {
                userContext.setIsLoggedIn(false);
            });
    };

    const handleLogout = async () => {
        await UserAPI.logout().catch((e: AxiosError<{ error: string }>) => {
            if (e.status === 400 && e.response?.data.error === NOT_LOGGED_IN_ERROR) {
                return;
            }
        });

        userContext.setIsLoggedIn(false);
        clearAmbitionsCache();
        clearObjectivesCache();
        clearActionsCache();
    };

    const isLoggedIn = userContext.isLoggedIn;

    return {
        updateLoginStatus,
        handleLogout,
        isLoggedIn,
    };
};

export default useUserAPI;
