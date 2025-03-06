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
                { name: '/ambitions', label: '大望' },
                { name: '/objectives', label: '目指す姿' },
                { name: '/actions', label: '行動' },
            ];
        if (pageName === 'Memos')
            return [
                { name: '/memos', label: 'メモ' },
                { name: '/mission-memos', label: '克服課題' },
                { name: '/book-excerpts', label: '読書ノート' },
            ];
        if (pageName === 'ActionTracks')
            return [
                { name: '/action-tracks', label: '計測' },
                { name: '/action-tracks/aggregations', label: '集計' },
            ];
        return [];
    }, [pageName]);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
            {tabNames.length > 0 && <CommonTabBar tabNames={tabNames} />}
            <BottomNavigation showLabels value={pageName}>
                <BottomNavigationAction
                    value='Ambitions'
                    label='我が道'
                    icon={<FlareIcon />}
                    onClick={() => {
                        navigate('/ambitions');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='Memos'
                    label='ノート'
                    icon={<NoteIcon />}
                    onClick={() => {
                        navigate('/memos');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='ActionTracks'
                    label='計測'
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
