import { Routes, Route, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Login from './pages/Login';
import Aggregations from './pages/ActionTrackAggregations/Aggregations';
import TagSettings from './pages/Settings/TagSettings';
import DailyAggregations from './pages/ActionTrackAggregations/DailyAggregations';
import WeeklyAggregations from './pages/ActionTrackAggregations/WeeklyAggregations';
import MonthlyAggregations from './pages/ActionTrackAggregations/MonthlyAggregations';
import MyWay from './pages/MyWay';
import Actions from './pages/Actions';
import Settings from './pages/Settings/Settings';
import NotificationSettings from './pages/Settings/NotificationSettings';
import Journals from './pages/Journal/Journals';
import useActionTrackContext from './hooks/useActionTrackContext';
import { useEffect } from 'react';
import useGlobalErrorContext from './hooks/useGlobalErrorContext';
import { CircularProgress, Snackbar } from '@mui/material';
import useUserContext from './hooks/useUserContext';
import { CurrentUserContext } from './contexts/current-user-context';

const AppRouter = () => {
    const { setShouldRefreshActionTracksCache } = useActionTrackContext();
    const { globalErrors, removeGlobalErrors } = useGlobalErrorContext();

    useEffect(() => {
        function markAsShouldClearCache() {
            if (!document.hidden) {
                setShouldRefreshActionTracksCache(true);
            }
        }
        document.addEventListener('visibilitychange', markAsShouldClearCache);

        return () => {
            document.removeEventListener('visibilitychange', markAsShouldClearCache);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} dateFormats={{ keyboardDate: 'yyyy/MM/dd', normalDate: 'yyyy/MM/dd' }}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="" element={<AuthenticatedRoutes />}>
                    <Route path="/my-way" element={<MyWay />} />
                    <Route path="/actions" element={<Actions />} />
                    <Route path="/aggregations" element={<Aggregations />} />
                    <Route path="/aggregations/daily" element={<DailyAggregations />} />
                    <Route path="/aggregations/weekly" element={<WeeklyAggregations />} />
                    <Route path="/aggregations/monthly" element={<MonthlyAggregations />} />
                    <Route path="/journals" element={<Journals />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/settings/tags" element={<TagSettings />} />
                    <Route path="/settings/notifications" element={<NotificationSettings />} />
                </Route>
            </Routes>
            {globalErrors.map((e, i) => (
                <Snackbar
                    key={i}
                    open
                    message={e.message}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    autoHideDuration={e.autoHideDurationMS}
                    onClose={() => e.autoHideDurationMS !== undefined && removeGlobalErrors(e)}
                    sx={{ mb: (i + 1) * 7 }}
                />
            ))}
        </LocalizationProvider>
    );
};

const AuthenticatedRoutes = () => {
    const { user, getUser } = useUserContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user === undefined) getUser();
    }, [getUser, user]);

    useEffect(() => {
        const pathParts = pathname.split('/');
        if (pathParts[0] === '' && pathParts[1] === '') {
            navigate(`/my-way`);
        }
    }, [navigate, pathname]);
    return user === undefined ? (
        <CircularProgress />
    ) : (
        <CurrentUserContext.Provider value={{ user }}>
            <Outlet />
        </CurrentUserContext.Provider>
    );
};

export default AppRouter;
