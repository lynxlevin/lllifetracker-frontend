import { useEffect, useContext } from 'react';
import { UserAPI } from '../apis/UserAPI';

const useUserAPI = () => {
    // const userContext = useContext(UserContext);

    const handleLogout = async () => {
        await UserAPI.logout();
        // userContext.setIsLoggedIn(false);
    };

    // // MYMEMO(後日): usexxxPage 以外の hook ではuseEffect しないほうがいいかも？
    // useEffect(() => {
    //     const checkSession = async () => {
    //         const session_res = await UserAPI.session();
    //         const isAuthenticated = session_res.data.is_authenticated;
    //         userContext.setIsLoggedIn(isAuthenticated);
    //         if (isAuthenticated) {
    //             // MYMEMO(後日): length ではなく、フラグを立てるべき
    //             if (cellarContext.cellarList.length === 0) {
    //                 const res = await CellarAPI.list();
    //                 const cellars = res.data.cellars;
    //                 cellarContext.setCellarList(cellars);
    //             }
    //             if (wineTagContext.wineTagList.length === 0) {
    //                 getWineTagList();
    //             }
    //             if (wineRegionContext.wineRegionList.length === 0) {
    //                 getWineRegionList();
    //             }
    //             if (grapeMasterContext.grapeMasterList.length === 0) {
    //                 getGrapeMasterList();
    //             }
    //         }
    //     };
    //     void checkSession();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return {
        handleLogout,
    };
};

export default useUserAPI;
