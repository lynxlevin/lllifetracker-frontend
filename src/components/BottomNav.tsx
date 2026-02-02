import BookIcon from '@mui/icons-material/Book';
import TimerIcon from '@mui/icons-material/Timer';
import TerrainIcon from '@mui/icons-material/Terrain';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import SettingsIcon from '@mui/icons-material/Settings';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { PageName } from './BasePage';
import { useMemo } from 'react';
import CommonTabBar from './CommonTabBar';

interface BottomNavProps {
    pageName: PageName;
}

const BottomNav = ({ pageName }: BottomNavProps) => {
    const navigate = useNavigate();

    const tabNames = useMemo(() => {
        switch (pageName) {
            case 'Journals':
                return [];
            case 'Aggregation':
                return [
                    { name: '/aggregations/monthly', label: '月ごと' },
                    { name: '/aggregations/weekly', label: '週ごと' },
                    { name: '/aggregations/daily', label: '日ごと' },
                    { name: '/aggregations', label: '期間指定' },
                ];
            case 'MyWay':
                return [];
            case 'Settings':
                return [];
            case 'Actions':
                return [];
        }
    }, [pageName]);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
            {tabNames.length > 0 && <CommonTabBar tabNames={tabNames} />}
            <BottomNavigation showLabels value={pageName}>
                <BottomNavigationAction
                    value="MyWay"
                    label="我が道"
                    icon={<TerrainIcon />}
                    onClick={() => {
                        navigate('/');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value="Journals"
                    label="日誌"
                    icon={<BookIcon />}
                    onClick={() => {
                        navigate('/journals');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value="Actions"
                    label="活動"
                    icon={<DirectionsWalkIcon />}
                    onClick={() => {
                        navigate('/actions');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value="Aggregation"
                    label="集計"
                    icon={<TimerIcon />}
                    onClick={() => {
                        navigate('/aggregations/monthly');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value="Settings"
                    label="設定"
                    icon={<SettingsIcon />}
                    onClick={() => {
                        navigate('/settings');
                        window.scroll({ top: 0 });
                    }}
                />
            </BottomNavigation>
        </Paper>
    );
};
export default BottomNav;
