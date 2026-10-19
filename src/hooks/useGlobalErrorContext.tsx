import { useContext } from 'react';
import { GlobalError, GlobalErrorContext, SetGlobalErrorContext } from '../contexts/global-error-context';
import { AxiosError } from 'axios';

// MYMEMO: validation error をこれに変える
const useGlobalErrorContext = () => {
    const globalErrorContext = useContext(GlobalErrorContext);
    const setGlobalErrorContext = useContext(SetGlobalErrorContext);

    const globalErrors = globalErrorContext.errors;
    const clearGlobalErrorsCache = () => {
        setGlobalErrorContext.setErrors([]);
    };

    const pushGlobalError = (error: GlobalError) => {
        setGlobalErrorContext.setErrors(prev => [...prev, error]);
    };

    const removeGlobalErrors = (error: GlobalError) => {
        setGlobalErrorContext.setErrors(prev =>
            [...prev].filter(e => {
                let isSame = true;
                isSame = isSame && e.message === error.message;
                isSame = isSame && e.componentName === error.componentName;
                isSame = isSame && e.methodName === error.methodName;
                return !isSame;
            }),
        );
    };

    const isError = (componentName: string | null, methodName: string) => {
        return globalErrors.filter(error => error.componentName === componentName && error.methodName === methodName).length > 0;
    };

    const handleAPIError = (error: AxiosError<{ error?: string }, any>, methodName?: string) => {
        const message = `[${error.message}] ${error.response?.data ?? ''}`;
        pushGlobalError({ message, componentName: null, methodName: methodName ?? 'APICall', autoHideDurationMS: 7000 });
    };

    const handleAPIErrorThrowing = (error: AxiosError<{ error?: string }, any>) => {
        handleAPIError(error);
        throw error;
    };

    return {
        globalErrors,
        clearGlobalErrorsCache,
        pushGlobalError,
        removeGlobalErrors,
        isError,
        handleAPIError,
        handleAPIErrorThrowing,
    };
};

export default useGlobalErrorContext;
