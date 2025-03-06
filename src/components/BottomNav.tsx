import NoteIcon from '@mui/icons-material/Note';
import FlareIcon from '@mui/icons-material/Flare';
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
        if (pageName === 'Ambitions')
            return [
                { name: '/ambitions', label: 'Life Purposes' },
                { name: '/objectives', label: 'Desired States' },
                { name: '/actions', label: 'Actions' },
            ];
        if (pageName === 'Memos')
            return [
                { name: '/memos', label: 'Memos' },
                { name: '/mission-memos', label: 'Challenges' },
                { name: '/book-excerpts', label: 'Reading Notes' },
            ];
        if (pageName === 'ActionTracks')
            return [
                { name: '/action-tracks', label: 'Track Actions' },
                { name: '/action-tracks/aggregations', label: 'Aggregation' },
            ];
        return [];
    }, [pageName]);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
            {tabNames.length > 0 && <CommonTabBar tabNames={tabNames} />}
            <BottomNavigation showLabels value={pageName}>
                <BottomNavigationAction
                    value='Ambitions'
                    label='Growth Plan'
                    icon={<FlareIcon />}
                    onClick={() => {
                        navigate('/ambitions');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='Memos'
                    label='Notes'
                    icon={<NoteIcon />}
                    onClick={() => {
                        navigate('/memos');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='ActionTracks'
                    label='Action Tracks'
                    icon={<NoteIcon />}
                    onClick={() => {
                        navigate('/action-tracks');
                        window.scroll({ top: 0 });
                    }}
                />
            </BottomNavigation>
        </Paper>
    );
};
export default BottomNav;
