import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button, Container, CssBaseline } from '@mui/material';
import { UserContext } from '../contexts/user-context';
import CommonAppBar from './CommonAppBar';
import useUserAPI from '../hooks/useUserAPI';
import Loading from '../pages/Loading';
import BottomNav from './BottomNav';
// import AppIcon from '../components/AppIcon';

export type PageName = 'Ambitions' | 'Memos' | 'ActionTracks';

interface BasePageProps {
    children: JSX.Element;
    pageName: PageName;
    needsAuth?: boolean;
    isLoading?: boolean;
}

const BasePage = ({ children, pageName, needsAuth = true, isLoading = false }: BasePageProps) => {
    const userContext = useContext(UserContext);
    const { handleLogout } = useUserAPI();

    const [now, setNow] = useState(new Date());

    const restDayValue = localStorage.getItem('rest_day_start_utc');

    if (restDayValue) {
        const restDay = new Date(restDayValue);
        if ((now.getTime() - restDay.getTime()) / 1000 / 60 / 60 < 24) {
            return (
                <>
                    今日はお休み{' '}
                    <Button
                        onClick={() => {
                            setNow(new Date());
                        }}
                    >
                        リフレッシュ
                    </Button>
                </>
            );
        }
    }
    if (needsAuth && userContext.isLoggedIn === false) {
        return <Navigate to='/login' />;
    }
    if (isLoading) {
        return <Loading />;
    }
    return (
        <>
            <CommonAppBar pageName={pageName} handleLogout={handleLogout} />
            <Container component='main' maxWidth='xs' sx={{ pb: 4 }}>
                <CssBaseline />
                {children}
            </Container>
            <BottomNav pageName={pageName} />
        </>
    );
};

export default BasePage;
