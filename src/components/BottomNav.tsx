import NoteIcon from '@mui/icons-material/Note';
import FlareIcon from '@mui/icons-material/Flare';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { PageName } from './BasePage';

interface BottomNavProps {
    pageName: PageName;
}

const BottomNav = ({ pageName }: BottomNavProps) => {
    const navigate = useNavigate();

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
            <BottomNavigation showLabels value={pageName}>
                <BottomNavigationAction
                    value='Ambitions'
                    label='Ambitions'
                    icon={<FlareIcon />}
                    onClick={() => {
                        navigate('/ambitions');
                        window.scroll({ top: 0 });
                    }}
                />
                <BottomNavigationAction
                    value='Memos'
                    label='Memos'
                    icon={<NoteIcon />}
                    onClick={() => {
                        navigate('/memos');
                        window.scroll({ top: 0 });
                    }}
                />
            </BottomNavigation>
        </Paper>
    );
};
export default BottomNav;
