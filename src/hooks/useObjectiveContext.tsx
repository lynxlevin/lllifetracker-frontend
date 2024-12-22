import { useCallback, useContext, useState } from 'react';
import { ObjectiveAPI } from '../apis/ObjectiveAPI';
import { ObjectiveContext } from '../contexts/objective-context';

const useObjectiveContext = () => {
    const objectiveContext = useContext(ObjectiveContext);

    const [isLoading, setIsLoading] = useState(false);

    const objectives = objectiveContext.objectiveList;
    const objectivesWithLinks = objectiveContext.objectivesWithLinksList;
    const clearObjectivesCache = () => {
        objectiveContext.setObjectiveList(undefined);
        objectiveContext.setObjectivesWithLinksList(undefined);
    };

    const getObjectivesWithLinks = useCallback(() => {
        setIsLoading(true);
        ObjectiveAPI.listWithLinks()
            .then(res => {
                objectiveContext.setObjectivesWithLinksList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [objectiveContext]);

    const getObjectives = useCallback(() => {
        setIsLoading(true);
        ObjectiveAPI.list()
            .then(res => {
                objectiveContext.setObjectiveList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [objectiveContext]);

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
    };
};

export default useObjectiveContext;
