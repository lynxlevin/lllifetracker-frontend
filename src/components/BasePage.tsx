import { useState } from 'react';
import { Button, Container, CssBaseline } from '@mui/material';
import CommonAppBar from './CommonAppBar';
import useUserAPI from '../hooks/useUserAPI';
import Loading from '../pages/Loading';
import BottomNav from './BottomNav';
// import AppIcon from '../components/AppIcon';

export type PageName = 'Journals' | 'Aggregation' | 'MyWay' | 'Settings';

interface BasePageProps {
    children: JSX.Element;
    pageName: PageName;
    needsAuth?: boolean;
    isLoading?: boolean;
}

const BasePage = ({ children, pageName, needsAuth = true, isLoading = false }: BasePageProps) => {
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
    if (isLoading) {
        return <Loading />;
    }
    return (
        <>
            <CommonAppBar handleLogout={handleLogout} />
            <Container component='main' maxWidth='xs' sx={{ pb: 14 }}>
                <CssBaseline />
                {children}
            </Container>
            <BottomNav pageName={pageName} />
        </>
    );
};

export default BasePage;
