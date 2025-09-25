import { Container, CssBaseline } from '@mui/material';
import CommonAppBar from './CommonAppBar';
import Loading from '../pages/Loading';
import BottomNav from './BottomNav';
// import AppIcon from '../components/AppIcon';

export type PageName = 'Journals' | 'Aggregation' | 'MyWay' | 'Settings' | 'Actions';

interface BasePageProps {
    children: JSX.Element;
    pageName: PageName;
    needsAuth?: boolean;
    isLoading?: boolean;
    breadCrumbAction?: () => void;
}

const BasePage = ({ children, pageName, needsAuth = true, isLoading = false, breadCrumbAction }: BasePageProps) => {
    if (isLoading) {
        return <Loading />;
    }
    return (
        <>
            <CommonAppBar breadCrumbAction={breadCrumbAction} />
            <Container component="main" maxWidth="xs" sx={{ pb: 14 }}>
                <CssBaseline />
                {children}
            </Container>
            <BottomNav pageName={pageName} />
        </>
    );
};

export default BasePage;
