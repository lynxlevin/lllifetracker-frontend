import { useContext, useState } from 'react';
import { ActionTrackAPI } from '../apis/ActionTrackAPI';
import { ActionTrackContext, SetActionTrackContext } from '../contexts/action-track-context';
import { format } from 'date-fns';

const useActionTrackContext = () => {
    const actionTrackContext = useContext(ActionTrackContext);
    const setActionTrackContext = useContext(SetActionTrackContext);

    const [isLoading, setIsLoading] = useState(false);

    const actionTracksByDate = actionTrackContext.actionTracksByDate;
    const activeActionTracks = actionTrackContext.activeActionTrackList;
    const clearActionTracksCache = () => {
        setActionTrackContext.setActionTracksByDate(undefined);
        setActionTrackContext.setActiveActionTrackList(undefined);
    };

    const getActionTracks = () => {
        setIsLoading(true);
        const actionTrackPromise = ActionTrackAPI.listByDate();
        const activeActionTrackPromise = ActionTrackAPI.list(true);
        Promise.all([actionTrackPromise, activeActionTrackPromise])
            .then(values => {
                setActionTrackContext.setActionTracksByDate(
                    values[0].data.map(list =>
                        list.map(track => {
                            track.startedAt = new Date(track.started_at);
                            if (track.ended_at !== null) track.endedAt = new Date(track.ended_at);
                            track.date = format(track.startedAt, 'yyyy-MM-dd E');
                            return track;
                        }),
                    ),
                );
                setActionTrackContext.setActiveActionTrackList(
                    values[1].data.map(track => {
                        track.startedAt = new Date(track.started_at);
                        return track;
                    }),
                );
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

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
        actionTracksByDate,
        activeActionTracks,
        clearActionTracksCache,
        getActionTracks,
        createActionTrack,
        updateActionTrack,
        deleteActionTrack,
    };
};

export default useActionTrackContext;
