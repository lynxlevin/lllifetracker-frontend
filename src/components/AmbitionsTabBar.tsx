import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const AmbitionsTabBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const getValue = () => {
        if (location.pathname === '/ambitions') return 0;
        if (location.pathname === '/objectives') return 1;
        if (location.pathname === '/actions') return 2;
    };
    const value = getValue();
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        if (newValue === 0) {
            navigate('/ambitions');
            window.scroll({ top: 0 });
        } else if (newValue === 1) {
            navigate('/objectives');
            window.scroll({ top: 0 });
        } else if (newValue === 2) {
            navigate('/actions');
            window.scroll({ top: 0 });
        }
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.default' }}>
            <Tabs value={value} onChange={handleChange} variant='fullWidth'>
                <Tab label='大望' {...a11yProps(0)} />
                <Tab label='目標' {...a11yProps(1)} />
                <Tab label='行動' {...a11yProps(2)} />
            </Tabs>
        </Box>
    );
};

export default AmbitionsTabBar;
