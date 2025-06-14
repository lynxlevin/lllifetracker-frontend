import { useCallback, useContext, useState } from 'react';
import { DesiredStateAPI } from '../apis/DesiredStateAPI';
import { DesiredStateContext, SetDesiredStateContext } from '../contexts/desired-state-context';

const useDesiredStateContext = () => {
    const desiredStateContext = useContext(DesiredStateContext);
    const setDesiredStateContext = useContext(SetDesiredStateContext);

    const [isLoading, setIsLoading] = useState(false);

    const desiredStates = desiredStateContext.desiredStateList;
    const clearDesiredStatesCache = () => {
        setDesiredStateContext.setDesiredStateList(undefined);
    };

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

    const createDesiredState = (name: string, description: string | null, category_id: string | null) => {
        DesiredStateAPI.create({ name, description, category_id }).then(res => {
            getDesiredStates();
        });
    };

    const updateDesiredState = (id: string, name: string, description: string | null, category_id: string | null) => {
        DesiredStateAPI.update(id, { name, description, category_id }).then(res => {
            getDesiredStates();
        });
    };

    const deleteDesiredState = (id: string) => {
        DesiredStateAPI.delete(id).then(_ => {
            getDesiredStates();
        });
    };

    const archiveDesiredState = (id: string) => {
        DesiredStateAPI.archive(id).then(_ => {
            getDesiredStates();
        });
    };

    const unarchiveDesiredState = (id: string) => {
        DesiredStateAPI.unarchive(id).then(_ => {
            getDesiredStates();
        });
    };

    const bulkUpdateDesiredStateOrdering = async (ordering: string[]) => {
        await DesiredStateAPI.bulk_update_ordering(ordering);
    };

    const convertDesiredStateToMindset = (id: string) => {
        DesiredStateAPI.convert(id).then(_ => {
            getDesiredStates();
        });
    };

    return {
        isLoading,
        desiredStates,
        clearDesiredStatesCache,
        getDesiredStates,
        createDesiredState,
        updateDesiredState,
        deleteDesiredState,
        archiveDesiredState,
        unarchiveDesiredState,
        bulkUpdateDesiredStateOrdering,
        convertDesiredStateToMindset,
    };
};

export default useDesiredStateContext;
