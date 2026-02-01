import { Box, Divider } from '@mui/material';
import BasePage from '../../components/BasePage';
import DirectionsSection from './DirectionsSection';
import AmbitionsSection from './AmbitionsSection';

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
