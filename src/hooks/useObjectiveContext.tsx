import { useCallback, useContext, useState } from 'react';
import { ObjectiveAPI } from '../apis/ObjectiveAPI';
import { ObjectiveContext } from '../contexts/objective-context';

const useObjectiveContext = () => {
    const objectiveContext = useContext(ObjectiveContext);

    const [isLoading, setIsLoading] = useState(false);

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

    const objectives = objectiveContext.objectiveList;
    const objectivesWithLinks = objectiveContext.objectivesWithLinksList;

    return {
        isLoading,
        getObjectives,
        getObjectivesWithLinks,
        objectives,
        objectivesWithLinks,
    };
};

export default useObjectiveContext;
