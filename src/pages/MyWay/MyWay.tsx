import { Box, Divider } from '@mui/material';
import BasePage from '../../components/BasePage';
import DesiredStatesSection from './DesiredStatesSection';
import AmbitionsSection from './AmbitionsSection';

const MyWay = () => {
    return (
        <BasePage pageName="MyWay">
            <Box sx={{ pt: 4 }}>
                <AmbitionsSection />
                <Divider color="#ccc" sx={{ my: 1 }} />
                <DesiredStatesSection />
            </Box>
        </BasePage>
    );
};

export default MyWay;
