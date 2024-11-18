import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import { UserContext } from '../contexts/user-context';
import CommonAppBar from './CommonAppBar';
import useUserAPI from '../hooks/useUserAPI';
import Loading from '../pages/Loading';
// import AppIcon from '../components/AppIcon';

interface BasePageProps {
    children: JSX.Element;
    needsAuth?: boolean;
    isLoading?: boolean;
}

const BasePage = ({ children, needsAuth = true, isLoading = false }: BasePageProps) => {
    const userContext = useContext(UserContext);
    const { handleLogout } = useUserAPI();

    if (needsAuth && userContext.isLoggedIn === false) {
        return <Navigate to='/login' />;
    }
    if (isLoading) {
        return <Loading />;
    }
    return (
        <>
            <CommonAppBar handleLogout={handleLogout} />
            <Container component='main' maxWidth='xs' sx={{ pb: 2 }}>
                <CssBaseline />
                {children}
            </Container>
        </>
    );
};

export default BasePage;
