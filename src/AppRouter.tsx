import { CircularProgress, Snackbar } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { CurrentUserContext } from "./contexts/current-user-context";
import useActionTrackContext from "./hooks/useActionTrackContext";
import useGlobalErrorContext from "./hooks/useGlobalErrorContext";
import useUserContext from "./hooks/useUserContext";
import Actions from "./pages/Actions";
import Aggregations from "./pages/ActionTrackAggregations/Aggregations";
import DailyAggregations from "./pages/ActionTrackAggregations/DailyAggregations";
import MonthlyAggregations from "./pages/ActionTrackAggregations/MonthlyAggregations";
import WeeklyAggregations from "./pages/ActionTrackAggregations/WeeklyAggregations";
import Journals from "./pages/Journal/Journals";
import Login from "./pages/Login";
import MyWay from "./pages/MyWay";
import Settings from "./pages/Settings/Settings";
import TagSettings from "./pages/Settings/TagSettings";

const AppRouter = () => {
    const { setShouldRefreshActionTracksCache } = useActionTrackContext();
    const { globalErrors, removeGlobalErrors } = useGlobalErrorContext();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <>
    useEffect(() => {
        function markAsShouldClearCache() {
            if (!document.hidden) {
                setShouldRefreshActionTracksCache(true);
            }
        }
        document.addEventListener("visibilitychange", markAsShouldClearCache);

        return () => {
            document.removeEventListener("visibilitychange", markAsShouldClearCache);
        };
    }, []);
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} dateFormats={{ keyboardDate: "yyyy/MM/dd", normalDate: "yyyy/MM/dd" }}>
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
                </Route>
            </Routes>
            {globalErrors.map((e, i) => (
                <Snackbar
                    key={`${e.componentName}-${e.methodName}`}
                    open
                    message={e.message}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    autoHideDuration={e.autoHideDurationMS}
                    onClose={() => e.autoHideDurationMS !== undefined && removeGlobalErrors(e)}
                    sx={{ mb: (i + 1) * 7 }}
                />
            ))}
        </LocalizationProvider>
    );
};

const AuthenticatedRoutes = () => {
    const { user, getUser, isGetUserError } = useUserContext();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <>
    useEffect(() => {
        if (user === undefined && !isGetUserError()) getUser();
    }, [user, isGetUserError]);

    useEffect(() => {
        const pathParts = pathname.split("/");
        if (pathParts[0] === "" && pathParts[1] === "") {
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
