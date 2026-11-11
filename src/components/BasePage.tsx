import { Container, CssBaseline } from "@mui/material";
import BottomNav from "./BottomNav";
import CommonAppBar from "./CommonAppBar";

export type PageName = "Journals" | "Aggregation" | "MyWay" | "Settings" | "Actions";

interface BasePageProps {
    children: JSX.Element;
    pageName: PageName;
    breadCrumbAction?: () => void;
}

const BasePage = ({ children, pageName, breadCrumbAction }: BasePageProps) => {
    return (
        <>
            <CommonAppBar breadCrumbAction={breadCrumbAction} />
            <Container component="main" maxWidth="sm" sx={{ pb: 14 }}>
                <CssBaseline />
                {children}
            </Container>
            <BottomNav pageName={pageName} />
        </>
    );
};

export default BasePage;
