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

    return {
        isLoading,
        actions,
        actionsWithLinks,
        clearActionsCache,
        getActions,
        getActionsWithLinks,
    };
};

export default useActionContext;
