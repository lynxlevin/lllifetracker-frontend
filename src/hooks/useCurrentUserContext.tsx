import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/current-user-context';

const useCurrentUserContext = () => {
    const currentUserContext = useContext(CurrentUserContext);

    const user = currentUserContext.user;

    return {
        user,
    };
};

export default useCurrentUserContext;
