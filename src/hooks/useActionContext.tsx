import { useCallback, useContext, useState } from 'react';
import { ActionAPI } from '../apis/ActionAPI';
import { ActionContext, SetActionContext } from '../contexts/action-context';

const useActionContext = () => {
    const actionContext = useContext(ActionContext);
    const setActionContext = useContext(SetActionContext);

    const [isLoading, setIsLoading] = useState(false);

    const actions = actionContext.actionList;
    const actionsWithLinks = actionContext.actionsWithLinksList;
    const clearActionsCache = () => {
        setActionContext.setActionList(undefined);
        setActionContext.setActionsWithLinksList(undefined);
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

    const getActionsWithLinks = useCallback(() => {
        setIsLoading(true);
        ActionAPI.listWithLinks()
            .then(res => {
                setActionContext.setActionsWithLinksList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setActionContext]);

    const createAction = (name: string, description: string | null) => {
        ActionAPI.create({ name, description }).then(res => {
            getActionsWithLinks();
            getActions();
        });
    };

    const updateAction = (id: string, name: string, description: string | null, trackable?: boolean, colorProp?: string) => {
        const color = colorProp !== '' ? colorProp : '#212121';
        ActionAPI.update(id, { name, description, trackable, color }).then(_ => {
            getActionsWithLinks();
            getActions();
        });
    };

    const deleteAction = (id: string) => {
        ActionAPI.delete(id).then(_ => {
            getActionsWithLinks();
        });
    };

    const archiveAction = (id: string) => {
        ActionAPI.archive(id).then(_ => {
            getActionsWithLinks();
            getActions();
        });
    };

    const unarchiveAction = (id: string) => {
        ActionAPI.unarchive(id).then(_ => {
            getActionsWithLinks();
            getActions();
        });
    };

    const bulkUpdateActionOrdering = async (ordering: string[]) => {
        await ActionAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        actions,
        actionsWithLinks,
        clearActionsCache,
        getActions,
        getActionsWithLinks,
        createAction,
        updateAction,
        deleteAction,
        archiveAction,
        unarchiveAction,
        bulkUpdateActionOrdering,
    };
};

export default useActionContext;
