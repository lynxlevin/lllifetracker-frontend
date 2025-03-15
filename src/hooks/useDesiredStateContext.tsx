import { useCallback, useContext, useState } from 'react';
import { DesiredStateAPI } from '../apis/DesiredStateAPI';
import { DesiredStateContext, SetDesiredStateContext } from '../contexts/desired-state-context';

const useDesiredStateContext = () => {
    const desiredStateContext = useContext(DesiredStateContext);
    const setDesiredStateContext = useContext(SetDesiredStateContext);

    const [isLoading, setIsLoading] = useState(false);

    const desiredStates = desiredStateContext.desiredStateList;
    const desiredStatesWithLinks = desiredStateContext.desiredStatesWithLinksList;
    const clearDesiredStatesCache = () => {
        setDesiredStateContext.setDesiredStateList(undefined);
        setDesiredStateContext.setDesiredStatesWithLinksList(undefined);
    };

    const getDesiredStatesWithLinks = useCallback(() => {
        setIsLoading(true);
        DesiredStateAPI.listWithLinks()
            .then(res => {
                setDesiredStateContext.setDesiredStatesWithLinksList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setDesiredStateContext]);

    const getDesiredStates = useCallback(() => {
        setIsLoading(true);
        DesiredStateAPI.list()
            .then(res => {
                setDesiredStateContext.setDesiredStateList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setDesiredStateContext]);

    const createDesiredState = (name: string, description: string | null) => {
        DesiredStateAPI.create({ name, description }).then(res => {
            getDesiredStatesWithLinks();
        });
    };

    const updateDesiredState = (id: string, name: string, description: string | null) => {
        DesiredStateAPI.update(id, { name, description }).then(res => {
            getDesiredStatesWithLinks();
        });
    };

    const deleteDesiredState = (id: string) => {
        DesiredStateAPI.delete(id).then(_ => {
            getDesiredStatesWithLinks();
        });
    };

    const archiveDesiredState = (id: string) => {
        DesiredStateAPI.archive(id).then(_ => {
            getDesiredStatesWithLinks();
        });
    };

    const bulkUpdateDesiredStateOrdering = async (ordering: string[]) => {
        await DesiredStateAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        desiredStates,
        desiredStatesWithLinks,
        clearDesiredStatesCache,
        getDesiredStates,
        getDesiredStatesWithLinks,
        createDesiredState,
        updateDesiredState,
        deleteDesiredState,
        archiveDesiredState,
        bulkUpdateDesiredStateOrdering,
    };
};

export default useDesiredStateContext;
