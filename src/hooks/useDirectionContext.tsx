import { useCallback, useContext, useState } from 'react';
import { DirectionAPI } from '../apis/DirectionAPI';
import { DirectionContext, SetDirectionContext } from '../contexts/direction-context';
import useTagContext from './useTagContext';
import useGlobalErrorContext from './useGlobalErrorContext';

const useDirectionContext = () => {
    const directionContext = useContext(DirectionContext);
    const setDirectionContext = useContext(SetDirectionContext);
    const { getTags } = useTagContext();
    const { handleAPIError, handleAPIErrorThrowing } = useGlobalErrorContext();

    const [isLoading, setIsLoading] = useState(false);

    const directions = directionContext.directionList;
    const activeDirections = directionContext.directionList?.filter(direction => !direction.archived);
    const archivedDirections = directionContext.directionList?.filter(direction => direction.archived);

    const clearDirectionsCache = () => {
        setDirectionContext.setDirectionList(undefined);
    };

    const getDirections = useCallback(() => {
        setIsLoading(true);
        DirectionAPI.list()
            .then(res => {
                setDirectionContext.setDirectionList(res.data);
            })
            .catch(handleAPIError)
            .finally(() => {
                setIsLoading(false);
            });
    }, [handleAPIError, setDirectionContext]);

    const createDirection = async (name: string, description: string | null, category_id: string | null) => {
        await DirectionAPI.create({ name, description, category_id })
            .then(_ => {
                getDirections();
                getTags();
            })
            .catch(handleAPIErrorThrowing);
    };

    const updateDirection = async (id: string, name: string, description: string | null, category_id: string | null) => {
        await DirectionAPI.update(id, { name, description, category_id })
            .then(res => {
                getDirections();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteDirection = async (id: string) => {
        await DirectionAPI.delete(id)
            .then(_ => {
                getDirections();
                getTags();
            })
            .catch(handleAPIErrorThrowing);
    };

    const archiveDirection = async (id: string) => {
        await DirectionAPI.archive(id)
            .then(_ => {
                getDirections();
            })
            .catch(handleAPIErrorThrowing);
    };

    const unarchiveDirection = async (id: string) => {
        await DirectionAPI.unarchive(id)
            .then(_ => {
                getDirections();
            })
            .catch(handleAPIErrorThrowing);
    };

    const bulkUpdateDirectionOrdering = async (ordering: string[]) => {
        await DirectionAPI.bulk_update_ordering(ordering).catch(handleAPIErrorThrowing);
    };

    return {
        isLoading,
        directions,
        activeDirections,
        archivedDirections,
        clearDirectionsCache,
        getDirections,
        createDirection,
        updateDirection,
        deleteDirection,
        archiveDirection,
        unarchiveDirection,
        bulkUpdateDirectionOrdering,
    };
};

export default useDirectionContext;
