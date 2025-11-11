import NoteIcon from '@mui/icons-material/Note';
import TimerIcon from '@mui/icons-material/Timer';
import FlareIcon from '@mui/icons-material/Flare';
import InsightsIcon from '@mui/icons-material/Insights';
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
                return [
                    { name: '/journals', label: 'ALL' },
                    { name: '/diaries', label: '日記' },
                    { name: '/thinking-notes', label: '思索ノート' },
                    { name: '/reading-notes', label: '読書ノート' },
                ];
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
                    icon={<FlareIcon />}
                    onClick={() => {
                        navigate('/');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value="Journals"
                    label="手記"
                    icon={<NoteIcon />}
                    onClick={() => {
                        navigate('/journals');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value="Actions"
                    label="活動"
                    icon={<InsightsIcon />}
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
