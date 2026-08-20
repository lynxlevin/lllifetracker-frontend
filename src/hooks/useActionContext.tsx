import { useCallback, useContext, useState } from 'react';
import { ActionAPI } from '../apis/ActionAPI';
import { ActionContext, SetActionContext } from '../contexts/action-context';
import type { ActionTrackType } from '../types/my_way';
import { ActionGoalAPI, ActionGoalCreateProps } from '../apis/ActionGoalAPI';
import useTagContext from './useTagContext';
import useGlobalErrorContext from './useGlobalErrorContext';

const useActionContext = () => {
    const actionContext = useContext(ActionContext);
    const setActionContext = useContext(SetActionContext);
    const { getTags } = useTagContext();
    const { handleAPIError, handleAPIErrorThrowing } = useGlobalErrorContext();

    const [isLoading, setIsLoading] = useState(false);

    const actions = actionContext.actionList;
    const activeActions = actionContext.actionList?.filter(action => !action.archived);
    const archivedActions = actionContext.actionList?.filter(action => action.archived);

    const clearActionsCache = () => {
        setActionContext.setActionList(undefined);
    };

    const getActions = useCallback(() => {
        setIsLoading(true);
        ActionAPI.list()
            .then(res => {
                setActionContext.setActionList(res.data);
            })
            .catch(handleAPIError)
            .finally(() => {
                setIsLoading(false);
            });
    }, [handleAPIError, setActionContext]);

    // FIXME: Fix this double API calls.
    const createAction = async (name: string, discipline: string | null, memo: string | null, trackType: ActionTrackType, color: string) => {
        await ActionAPI.create({ name, discipline, memo, track_type: trackType })
            .then(res => {
                const action_id = res.data.id;
                getTags();
                updateAction(action_id, name, discipline, memo, color);
            })
            .catch(handleAPIErrorThrowing);
    };

    const updateAction = async (id: string, name: string, discipline: string | null, memo: string | null, colorProp?: string) => {
        const color = colorProp !== '' ? colorProp : '#212121';
        await ActionAPI.update(id, { name, discipline, memo, color })
            .then(_ => {
                getActions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const convertActionTrackType = async (id: string, trackType: ActionTrackType) => {
        await ActionAPI.convert_track_type(id, { track_type: trackType })
            .then(_ => {
                getActions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteAction = async (id: string) => {
        await ActionAPI.delete(id)
            .then(_ => {
                getActions();
                getTags();
            })
            .catch(handleAPIErrorThrowing);
    };

    const archiveAction = async (id: string) => {
        await ActionAPI.archive(id)
            .then(_ => {
                getActions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const unarchiveAction = async (id: string) => {
        await ActionAPI.unarchive(id)
            .then(_ => {
                getActions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const bulkUpdateActionOrdering = async (ordering: string[]) => {
        await ActionAPI.bulk_update_ordering(ordering).catch(handleAPIErrorThrowing);
    };

    const setActionGoal = async (props: ActionGoalCreateProps) => {
        await ActionGoalAPI.create(props)
            .then(_ => {
                getActions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const removeActionGoal = async (actionId: string) => {
        await ActionGoalAPI.delete(actionId)
            .then(_ => {
                getActions();
            })
            .catch(handleAPIErrorThrowing);
    };

    return {
        isLoading,
        actions,
        activeActions,
        archivedActions,
        clearActionsCache,
        getActions,
        createAction,
        updateAction,
        convertActionTrackType,
        deleteAction,
        archiveAction,
        unarchiveAction,
        bulkUpdateActionOrdering,
        setActionGoal,
        removeActionGoal,
    };
};

export default useActionContext;
