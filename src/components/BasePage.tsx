import { Container, CssBaseline } from '@mui/material';
import CommonAppBar from './CommonAppBar';
import BottomNav from './BottomNav';

export type PageName = 'Journals' | 'Aggregation' | 'MyWay' | 'Settings' | 'Actions';

interface BasePageProps {
    children: JSX.Element;
    pageName: PageName;
    breadCrumbAction?: () => void;
}

const BasePage = ({ children, pageName, breadCrumbAction }: BasePageProps) => {
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
