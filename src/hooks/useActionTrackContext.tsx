import { useContext, useState } from 'react';
import { ActionTrackAPI } from '../apis/ActionTrackAPI';
import { ActionTrackContext, SetActionTrackContext } from '../contexts/action-track-context';
import { format } from 'date-fns';
import type { ActionTrack } from '../types/action_track';

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

    const getActiveActionTracks = () => {
        ActionTrackAPI.list(true)
            .then(res => {
                setActionTrackContext.setActiveActionTrackList(
                    res.data.map(track => {
                        track.startedAt = new Date(track.started_at);
                        return track;
                    }),
                );
            })
            .catch(e => {
                console.error(e);
            });
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

    const startTracking = (actionId: string) => {
        ActionTrackAPI.create({
            started_at: new Date().toISOString(),
            action_id: actionId,
        }).then(_ => {
            getActiveActionTracks();
        });
    };

    const stopTracking = (actionTrack: ActionTrack) => {
        ActionTrackAPI.update(actionTrack.id, {
            started_at: actionTrack.started_at,
            ended_at: new Date().toISOString(),
            action_id: actionTrack.action_id,
        }).then(_ => {
            getActionTracks();
        });
    };

    return {
        isLoading,
        actionTracksByDate,
        activeActionTracks,
        clearActionTracksCache,
        getActionTracks,
        updateActionTrack,
        deleteActionTrack,
        startTracking,
        stopTracking,
    };
};

export default useActionTrackContext;
