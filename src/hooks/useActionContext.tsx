import { useCallback, useContext, useState } from 'react';
import { ActionAPI } from '../apis/ActionAPI';
import { ActionContext, SetActionContext } from '../contexts/action-context';
import type { ActionTrackType } from '../types/my_way';

const useActionContext = () => {
    const actionContext = useContext(ActionContext);
    const setActionContext = useContext(SetActionContext);

    const [isLoading, setIsLoading] = useState(false);

    const actions = actionContext.actionList;
    const clearActionsCache = () => {
        setActionContext.setActionList(undefined);
    };

    const getActions = useCallback(() => {
        setIsLoading(true);
        ActionAPI.list()
            .then(res => {
                setActionContext.setActionList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setActionContext]);

    const createAction = (name: string, description: string | null, trackType: ActionTrackType) => {
        ActionAPI.create({ name, description, track_type: trackType }).then(res => {
            getActions();
        });
    };

    const updateAction = (id: string, name: string, description: string | null, trackable?: boolean, colorProp?: string) => {
        const color = colorProp !== '' ? colorProp : '#212121';
        ActionAPI.update(id, { name, description, trackable, color }).then(_ => {
            getActions();
        });
    };

    const convertActionTrackType = (id: string, trackType: ActionTrackType) => {
        ActionAPI.convert_track_type(id, { track_type: trackType }).then(_ => {
            getActions();
        });
    };

    const deleteAction = (id: string) => {
        ActionAPI.delete(id).then(_ => {
            getActions();
        });
    };

    const archiveAction = (id: string) => {
        ActionAPI.archive(id).then(_ => {
            getActions();
        });
    };

    const unarchiveAction = (id: string) => {
        ActionAPI.unarchive(id).then(_ => {
            getActions();
        });
    };

    const bulkUpdateActionOrdering = async (ordering: string[]) => {
        await ActionAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        actions,
        clearActionsCache,
        getActions,
        createAction,
        updateAction,
        convertActionTrackType,
        deleteAction,
        archiveAction,
        unarchiveAction,
        bulkUpdateActionOrdering,
    };
};

export default useActionContext;
