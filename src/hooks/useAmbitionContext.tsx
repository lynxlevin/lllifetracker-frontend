import { useCallback, useContext, useState } from 'react';
import { AmbitionContext, SetAmbitionContext } from '../contexts/ambition-context';
import { AmbitionAPI } from '../apis/AmbitionAPI';
import { ObjectiveAPI } from '../apis/ObjectiveAPI';
import { ActionAPI } from '../apis/ActionAPI';

const useAmbitionContext = () => {
    const ambitionContext = useContext(AmbitionContext);
    const setAmbitionContext = useContext(SetAmbitionContext);

    const [isLoading, setIsLoading] = useState(false);

    const ambitionsWithLinks = ambitionContext.ambitionWithLinksList;
    const clearAmbitionsCache = () => {
        setAmbitionContext.setAmbitionWithLinksList(undefined);
    };

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
        });
    };

    const updateAmbition = (id: string, name: string, description: string | null) => {
        AmbitionAPI.update(id, { name, description }).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const deleteAmbition = (id: string) => {
        AmbitionAPI.delete(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const archiveAmbition = (id: string) => {
        AmbitionAPI.archive(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const addObjective = (ambitionId: string, name: string, description: string | null) => {
        ObjectiveAPI.create({ name, description }).then(res => {
            const objective = res.data;
            AmbitionAPI.linkObjective(ambitionId, objective.id).then(_ => {
                getAmbitionsWithLinks();
            });
        });
    };

    const updateObjective = (id: string, name: string, description: string | null) => {
        ObjectiveAPI.update(id, { name, description }).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const deleteObjective = (id: string) => {
        ObjectiveAPI.delete(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const archiveObjective = (id: string) => {
        ObjectiveAPI.archive(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const addAction = (objectiveId: string, name: string, description: string | null) => {
        ActionAPI.create({ name, description }).then(res => {
            const action = res.data;
            ObjectiveAPI.linkAction(objectiveId, action.id).then(_ => {
                getAmbitionsWithLinks();
            });
        });
    };

    const updateAction = (id: string, name: string, description: string | null, trackable?: boolean) => {
        ActionAPI.update(id, { name, description, trackable }).then(_ => {
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

    const linkObjectives = async (id: string, objectiveIds: string[], updateAmbitions = false) => {
        for (const objectiveId of objectiveIds) {
            await AmbitionAPI.linkObjective(id, objectiveId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    const unlinkObjectives = async (id: string, objectiveIds: string[], updateAmbitions = false) => {
        for (const objectiveId of objectiveIds) {
            await AmbitionAPI.unlinkObjective(id, objectiveId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    const linkActions = async (id: string, actionIds: string[], updateAmbitions = false) => {
        for (const actionId of actionIds) {
            await ObjectiveAPI.linkAction(id, actionId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    const unlinkActions = async (id: string, actionIds: string[], updateAmbitions = false) => {
        for (const actionId of actionIds) {
            await ObjectiveAPI.unlinkAction(id, actionId);
        }
        if (updateAmbitions) getAmbitionsWithLinks();
    };

    return {
        isLoading,
        ambitionsWithLinks,
        clearAmbitionsCache,
        getAmbitionsWithLinks,
        createAmbition,
        updateAmbition,
        deleteAmbition,
        archiveAmbition,
        addObjective,
        updateObjective,
        deleteObjective,
        archiveObjective,
        addAction,
        updateAction,
        deleteAction,
        archiveAction,
        linkObjectives,
        unlinkObjectives,
        linkActions,
        unlinkActions,
    };
};

export default useAmbitionContext;
