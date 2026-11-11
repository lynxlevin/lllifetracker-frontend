import { Box, Divider } from "@mui/material";
import BasePage from "../../components/BasePage";
import AmbitionsSection from "./AmbitionsSection";
import DirectionsSection from "./DirectionsSection";

const MyWay = () => {
    return (
        <BasePage pageName="MyWay">
            <Box sx={{ pt: 4 }}>
                <AmbitionsSection />
                <Divider color="#ccc" sx={{ my: 1 }} />
                <DirectionsSection />
            </Box>
        </BasePage>
    );
};

export default MyWay;
