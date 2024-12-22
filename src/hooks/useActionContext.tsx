import { useCallback, useContext, useState } from 'react';
import { ActionAPI } from '../apis/ActionAPI';
import { ActionContext } from '../contexts/action-context';

const useActionContext = () => {
    const actionContext = useContext(ActionContext);

    const [isLoading, setIsLoading] = useState(false);

    const actions = actionContext.actionList;
    const actionsWithLinks = actionContext.actionsWithLinksList;
    const clearActionsCache = () => {
        actionContext.setActionList(undefined);
        actionContext.setActionsWithLinksList(undefined);
    };

    const getActions = useCallback(() => {
        setIsLoading(true);
        ActionAPI.list()
            .then(res => {
                actionContext.setActionList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [actionContext]);

    const getActionsWithLinks = useCallback(() => {
        setIsLoading(true);
        ActionAPI.listWithLinks()
            .then(res => {
                actionContext.setActionsWithLinksList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [actionContext]);

    const createAction = (name: string, description: string | null) => {
        ActionAPI.create({ name, description }).then(res => {
            getActionsWithLinks();
        });
    };

    const updateAction = (id: string, name: string, description: string | null) => {
        ActionAPI.update(id, { name, description }).then(_ => {
            getActionsWithLinks();
        });
    };

    const deleteAction = (id: string) => {
        ActionAPI.delete(id).then(_ => {
            getActionsWithLinks();
        });
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
    };
};

export default useActionContext;
