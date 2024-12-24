import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface CommonTabBarProps {
    pathNames: { name: string; label: string }[];
}

const CommonTabBar = ({ pathNames }: CommonTabBarProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        navigate(pathNames[newValue].name);
        window.scroll({ top: 0 });
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.default' }}>
            <Tabs value={pathNames.findIndex(item => item.name === location.pathname)} onChange={handleChange} variant='fullWidth'>
                {pathNames.map((item, i) => (
                    <Tab key={`simple-tab-${item.name}`} label={item.label} {...a11yProps(i)} />
                ))}
            </Tabs>
        </Box>
    );
};

export default CommonTabBar;
