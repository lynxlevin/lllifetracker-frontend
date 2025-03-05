import { UserAPI } from '../apis/UserAPI';
import type { AxiosError } from 'axios';
import useAmbitionContext from './useAmbitionContext';
import useObjectiveContext from './useObjectiveContext';
import useActionContext from './useActionContext';
import useMemoContext from './useMemoContext';
import useMissionMemoContext from './useMissionMemoContext';
import useBookExcerptContext from './useBookExcerptContext';
import useTagContext from './useTagContext';
import useActionTrackContext from './useActionTrackContext';

const useUserAPI = () => {
    const { clearActionsCache } = useActionContext();
    const { clearActionTracksCache } = useActionTrackContext();
    const { clearAmbitionsCache } = useAmbitionContext();
    const { clearBookExcerptsCache } = useBookExcerptContext();
    const { clearMemosCache } = useMemoContext();
    const { clearMissionMemosCache } = useMissionMemoContext();
    const { clearObjectivesCache } = useObjectiveContext();
    const { clearTagsCache } = useTagContext();

    const NOT_LOGGED_IN_ERROR = 'We currently have some issues. Kindly try again and ensure you are logged in.';

    const handleLogout = async () => {
        await UserAPI.logout().catch((e: AxiosError<{ error: string }>) => {
            if (e.status === 400 && e.response?.data.error === NOT_LOGGED_IN_ERROR) {
                return;
            }
        });

        clearActionsCache();
        clearActionTracksCache();
        clearAmbitionsCache();
        clearBookExcerptsCache();
        clearMemosCache();
        clearMissionMemosCache();
        clearObjectivesCache();
        clearTagsCache();
    };

    return {
        handleLogout,
    };
};

export default useUserAPI;
