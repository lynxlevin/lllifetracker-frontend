import { useCallback, useContext, useState } from 'react';
import { AmbitionContext, SetAmbitionContext } from '../contexts/ambition-context';
import { AmbitionAPI } from '../apis/AmbitionAPI';
import { DesiredStateAPI } from '../apis/DesiredStateAPI';
import { ActionAPI } from '../apis/ActionAPI';

const useAmbitionContext = () => {
    const ambitionContext = useContext(AmbitionContext);
    const setAmbitionContext = useContext(SetAmbitionContext);

    const [isLoading, setIsLoading] = useState(false);

    const ambitions = ambitionContext.ambitionList;
    const ambitionsWithLinks = ambitionContext.ambitionWithLinksList;
    const clearAmbitionsCache = () => {
        setAmbitionContext.setAmbitionWithLinksList(undefined);
    };

    const getAmbitions = useCallback(() => {
        setIsLoading(true);
        AmbitionAPI.list()
            .then(res => {
                setAmbitionContext.setAmbitionList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setAmbitionContext]);

    const getAmbitionsWithLinks = useCallback(() => {
        setIsLoading(true);
        AmbitionAPI.listWithLinks()
            .then(res => {
                setAmbitionContext.setAmbitionWithLinksList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setAmbitionContext]);

    const createAmbition = (name: string, description: string | null) => {
        AmbitionAPI.create({ name, description }).then(_ => {
            getAmbitionsWithLinks();
            getAmbitions();
        });
    };

    const updateAmbition = (id: string, name: string, description: string | null) => {
        AmbitionAPI.update(id, { name, description }).then(_ => {
            getAmbitionsWithLinks();
            getAmbitions();
        });
    };

    const deleteAmbition = (id: string) => {
        AmbitionAPI.delete(id).then(_ => {
            getAmbitionsWithLinks();
            getAmbitions();
        });
    };

    const archiveAmbition = (id: string) => {
        AmbitionAPI.archive(id).then(_ => {
            getAmbitionsWithLinks();
            getAmbitions();
        });
    };

    const unarchiveAmbition = (id: string) => {
        AmbitionAPI.unarchive(id).then(_ => {
            getAmbitionsWithLinks();
            getAmbitions();
        });
    };

    const addDesiredState = (ambitionId: string, name: string, description: string | null) => {
        DesiredStateAPI.create({ name, description }).then(res => {
            const desiredState = res.data;
            AmbitionAPI.linkDesiredState(ambitionId, desiredState.id).then(_ => {
                getAmbitionsWithLinks();
            });
        });
    };

    const updateDesiredState = (id: string, name: string, description: string | null) => {
        DesiredStateAPI.update(id, { name, description }).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const deleteDesiredState = (id: string) => {
        DesiredStateAPI.delete(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const archiveDesiredState = (id: string) => {
        DesiredStateAPI.archive(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const addAction = (desiredStateId: string, name: string, description: string | null) => {
        ActionAPI.create({ name, description }).then(res => {
            const action = res.data;
            DesiredStateAPI.linkAction(desiredStateId, action.id).then(_ => {
                getAmbitionsWithLinks();
            });
        });
    };

    const updateAction = (id: string, name: string, description: string | null, trackable?: boolean, color?: string) => {
        ActionAPI.update(id, { name, description, trackable, color }).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const deleteAction = (id: string) => {
        ActionAPI.delete(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const archiveAction = (id: string) => {
        ActionAPI.archive(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const linkDesiredStates = async (id: string, desiredStateIds: string[], updateAmbitions = false) => {
        for (const desiredStateId of desiredStateIds) {
            await AmbitionAPI.linkDesiredState(id, desiredStateId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    const unlinkDesiredStates = async (id: string, desiredStateIds: string[], updateAmbitions = false) => {
        for (const desiredStateId of desiredStateIds) {
            await AmbitionAPI.unlinkDesiredState(id, desiredStateId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    const linkActions = async (id: string, actionIds: string[], updateAmbitions = false) => {
        for (const actionId of actionIds) {
            await DesiredStateAPI.linkAction(id, actionId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    const unlinkActions = async (id: string, actionIds: string[], updateAmbitions = false) => {
        for (const actionId of actionIds) {
            await DesiredStateAPI.unlinkAction(id, actionId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    const bulkUpdateAmbitionOrdering = async (ordering: string[]) => {
        await AmbitionAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        ambitions,
        ambitionsWithLinks,
        clearAmbitionsCache,
        getAmbitions,
        getAmbitionsWithLinks,
        createAmbition,
        updateAmbition,
        deleteAmbition,
        archiveAmbition,
        unarchiveAmbition,
        addDesiredState,
        updateDesiredState,
        deleteDesiredState,
        archiveDesiredState,
        addAction,
        updateAction,
        deleteAction,
        archiveAction,
        linkDesiredStates,
        unlinkDesiredStates,
        linkActions,
        unlinkActions,
        bulkUpdateAmbitionOrdering,
    };
};

export default useAmbitionContext;
