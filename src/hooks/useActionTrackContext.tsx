import { useCallback, useContext, useState } from 'react';
import { ActionTrackAPI } from '../apis/ActionTrackAPI';
import { ActionTrackContext, SetActionTrackContext } from '../contexts/action-track-context';

const useActionTrackContext = () => {
    const actionTrackContext = useContext(ActionTrackContext);
    const setActionTrackContext = useContext(SetActionTrackContext);

    const [isLoading, setIsLoading] = useState(false);

    const actionTracks = actionTrackContext.actionTrackList;
    const activeActionTracks = actionTrackContext.activeActionTrackList;
    const clearActionTracksCache = () => {
        setActionTrackContext.setActionTrackList(undefined);
        setActionTrackContext.setActiveActionTrackList(undefined);
    };

    const getActionTracks = useCallback(() => {
        setIsLoading(true);
        ActionTrackAPI.list()
            .then(res => {
                setActionTrackContext.setActionTrackList(res.data);
                ActionTrackAPI.list(true)
                    .then(res => {
                        setActionTrackContext.setActiveActionTrackList(res.data);
                    })
                    .catch(e => {
                        console.error(e);
                    });
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setActionTrackContext]);

    const createActionTrack = (startedAt: Date, action_id: string | null) => {
        ActionTrackAPI.create({ started_at: startedAt.toISOString(), action_id }).then(_ => {
            getActionTracks();
        });
    };

    const updateActionTrack = (id: string, startedAt: Date, endedAt: Date | null, action_id: string | null) => {
        ActionTrackAPI.update(id, { started_at: startedAt.toISOString(), ended_at: endedAt === null ? null : endedAt.toISOString(), action_id }).then(_ => {
            getActionTracks();
        });
    };

    const deleteActionTrack = (id: string) => {
        ActionTrackAPI.delete(id).then(_ => {
            getActionTracks();
        });
    };

    return {
        isLoading,
        actionTracks,
        activeActionTracks,
        clearActionTracksCache,
        getActionTracks,
        createActionTrack,
        updateActionTrack,
        deleteActionTrack,
    };
};

export default useActionTrackContext;
