import { Box } from '@mui/material';
import BasePage from '../../components/BasePage';
import MindsetsSection from './MindsetsSection';

const Mindsets = () => {
    return (
        <BasePage pageName='Mindsets'>
            <Box sx={{ pt: 4 }}>
                <MindsetsSection />
            </Box>
        </BasePage>
    );
};

export default Mindsets;
