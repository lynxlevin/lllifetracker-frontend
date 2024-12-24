import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const MemosTabBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const getValue = () => {
        if (location.pathname === '/memos') return 0;
        if (location.pathname === '/mission-memos') return 1;
        if (location.pathname === '/book-excerpts') return 2;
    };
    const value = getValue();
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        if (newValue === 0) {
            navigate('/memos');
            window.scroll({ top: 0 });
        } else if (newValue === 1) {
            navigate('/mission-memos');
            window.scroll({ top: 0 });
        } else if (newValue === 2) {
            navigate('/book-excerpts');
            window.scroll({ top: 0 });
        }
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.default' }}>
            <Tabs value={value} onChange={handleChange} variant='fullWidth'>
                <Tab label='メモ' {...a11yProps(0)} />
                <Tab label='課題' {...a11yProps(1)} />
                <Tab label='本の抜粋' {...a11yProps(2)} />
            </Tabs>
        </Box>
    );
};

export default MemosTabBar;
