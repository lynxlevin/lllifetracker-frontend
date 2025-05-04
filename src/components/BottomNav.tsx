import NoteIcon from '@mui/icons-material/Note';
import TimerIcon from '@mui/icons-material/Timer';
import FlareIcon from '@mui/icons-material/Flare';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
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
                    { name: '/diaries', label: '日記' },
                    { name: '/reading-notes', label: '読書ノート' },
                ];
            case 'ActionTracks':
                return [];
            case 'MyWay':
                return [];
            case 'Mindsets':
                return [];
            case 'Settings':
                return [{ name: '/settings/tags', label: 'タグ' }];
        }
    }, [pageName]);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
            {tabNames.length > 0 && <CommonTabBar tabNames={tabNames} />}
            <BottomNavigation showLabels value={pageName}>
                <BottomNavigationAction
                    value='MyWay'
                    label='我が道'
                    icon={<FlareIcon />}
                    onClick={() => {
                        navigate('/');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='Mindsets'
                    label='心掛け'
                    icon={<SelfImprovementIcon />}
                    onClick={() => {
                        navigate('/mindsets');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='ActionTracks'
                    label='集計'
                    icon={<TimerIcon />}
                    onClick={() => {
                        navigate('/action-tracks/aggregations');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='Journals'
                    label='手記'
                    icon={<NoteIcon />}
                    onClick={() => {
                        navigate('/diaries');
                        window.scroll({ top: 0 });
                    }}
                />
            </BottomNavigation>
        </Paper>
    );
};
export default BottomNav;
