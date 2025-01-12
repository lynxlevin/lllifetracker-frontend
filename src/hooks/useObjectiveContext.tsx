import { useCallback, useContext, useState } from 'react';
import { ObjectiveAPI } from '../apis/ObjectiveAPI';
import { ObjectiveContext, SetObjectiveContext } from '../contexts/objective-context';

const useObjectiveContext = () => {
    const objectiveContext = useContext(ObjectiveContext);
    const setObjectiveContext = useContext(SetObjectiveContext);

    const [isLoading, setIsLoading] = useState(false);

    const objectives = objectiveContext.objectiveList;
    const objectivesWithLinks = objectiveContext.objectivesWithLinksList;
    const clearObjectivesCache = () => {
        setObjectiveContext.setObjectiveList(undefined);
        setObjectiveContext.setObjectivesWithLinksList(undefined);
    };

    const getObjectivesWithLinks = useCallback(() => {
        setIsLoading(true);
        ObjectiveAPI.listWithLinks()
            .then(res => {
                setObjectiveContext.setObjectivesWithLinksList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setObjectiveContext]);

    const getObjectives = useCallback(() => {
        setIsLoading(true);
        ObjectiveAPI.list()
            .then(res => {
                setObjectiveContext.setObjectiveList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setObjectiveContext]);

    const createObjective = (name: string, description: string | null) => {
        ObjectiveAPI.create({ name, description }).then(res => {
            getObjectivesWithLinks();
        });
    };

    const updateObjective = (id: string, name: string, description: string | null) => {
        ObjectiveAPI.update(id, { name, description }).then(res => {
            getObjectivesWithLinks();
        });
    };

    const deleteObjective = (id: string) => {
        ObjectiveAPI.delete(id).then(_ => {
            getObjectivesWithLinks();
        });
    };

    const archiveObjective = (id: string) => {
        ObjectiveAPI.archive(id).then(_ => {
            getObjectivesWithLinks();
        });
    };

    return {
        isLoading,
        objectives,
        objectivesWithLinks,
        clearObjectivesCache,
        getObjectives,
        getObjectivesWithLinks,
        createObjective,
        updateObjective,
        deleteObjective,
        archiveObjective,
    };
};

export default useObjectiveContext;
