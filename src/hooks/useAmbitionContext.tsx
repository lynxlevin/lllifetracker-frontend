import { useCallback, useContext, useState } from 'react';
import { AmbitionContext } from '../contexts/ambition-context';
import { AmbitionAPI } from '../apis/AmbitionAPI';
import { ObjectiveAPI } from '../apis/ObjectiveAPI';
import { ActionAPI } from '../apis/ActionAPI';

const useAmbitionContext = () => {
    const ambitionContext = useContext(AmbitionContext);

    const [isLoading, setIsLoading] = useState(false);

    const getAmbitionsWithLinks = useCallback(() => {
        setIsLoading(true);
        AmbitionAPI.listWithLinks()
            .then(res => {
                ambitionContext.setAmbitionWithLinksList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [ambitionContext]);

    const ambitionsWithLinks = ambitionContext.ambitionWithLinksList;

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

    const addObjective = (ambitionId: string, name: string) => {
        ObjectiveAPI.create({ name }).then(res => {
            const objective = res.data;
            AmbitionAPI.linkObjective(ambitionId, objective.id).then(_ => {
                getAmbitionsWithLinks();
            });
        });
    };

    const updateObjective = (id: string, name: string) => {
        ObjectiveAPI.update(id, { name }).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const deleteObjective = (id: string) => {
        ObjectiveAPI.delete(id).then(_ => {
            getAmbitionsWithLinks();
        });
    };

    const addAction = (objectiveId: string, name: string) => {
        ActionAPI.create({ name }).then(res => {
            const action = res.data;
            ObjectiveAPI.linkAction(objectiveId, action.id).then(_ => {
                getAmbitionsWithLinks();
            });
        });
    };

    const updateAction = (id: string, name: string) => {
        ActionAPI.update(id, { name }).then(res => {
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
        getAmbitionsWithLinks,
        ambitionsWithLinks,
        createAmbition,
        updateAmbition,
        deleteAmbition,
        addObjective,
        updateObjective,
        deleteObjective,
        addAction,
        updateAction,
        linkObjectives,
        unlinkObjectives,
        linkActions,
        unlinkActions,
    };
};

export default useAmbitionContext;
