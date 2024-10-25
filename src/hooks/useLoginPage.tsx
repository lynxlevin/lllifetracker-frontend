import { useContext, useState } from 'react';
import { UserAPI } from '../apis/UserAPI';
import { UserContext } from '../contexts/user-context';
import { AxiosError } from 'axios';

const useLoginPage = () => {
    const userContext = useContext(UserContext);

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleEmailInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setEmail(event.target.value);
    };

    const handlePasswordInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPassword(event.target.value);
    };

    const handleLogin = async () => {
        if (inputIsValid()) {
            setErrorMessage(null);
            UserAPI.login({ email, password })
                .then(_ => {
                    userContext.setIsLoggedIn(true);
                })
                .catch((e: AxiosError<{ error: string }>) => {
                    setErrorMessage(e.response?.data.error ?? null);
                });
        }
    };

    const inputIsValid = () => {
        if (email === '') {
            setErrorMessage('Please input email.');
            return false;
        }
        if (password === '') {
            setErrorMessage('Please input password.');
            return false;
        }
        return true;
    };

    return {
        errorMessage,
        handleLogin,
        handleEmailInput,
        handlePasswordInput,
    };
};

export default useLoginPage;
