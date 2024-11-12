import { useCallback, useContext, useState } from 'react';
import { ObjectiveAPI } from '../apis/ObjectiveAPI';
import { ObjectiveContext } from '../contexts/objective-context';

const useObjectiveContext = () => {
    const objectiveContext = useContext(ObjectiveContext);

    const [isLoading, setIsLoading] = useState(false);

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

    return {
        isLoading,
        getObjectives,
        objectives,
    };
};

export default useObjectiveContext;
