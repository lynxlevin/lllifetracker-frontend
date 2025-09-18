import { Box, Divider } from '@mui/material';
import BasePage from '../../components/BasePage';
import DesiredStatesSectionV2 from './DesiredStatesSectionV2';
import AmbitionsSectionV2 from './AmbitionsSectionV2';

const MyWay = () => {
    return (
        <BasePage pageName="MyWay">
            <Box sx={{ pt: 4 }}>
                <AmbitionsSectionV2 />
                <Divider color="#ccc" sx={{ my: 1 }} />
                <DesiredStatesSectionV2 />
            </Box>
        </BasePage>
    );
};

export default MyWay;
