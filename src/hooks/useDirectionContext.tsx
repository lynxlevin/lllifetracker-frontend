import { useCallback, useContext, useState } from 'react';
import { DirectionAPI } from '../apis/DirectionAPI';
import { DirectionContext, SetDirectionContext } from '../contexts/direction-context';

const useDirectionContext = () => {
    const directionContext = useContext(DirectionContext);
    const setDirectionContext = useContext(SetDirectionContext);

    const [isLoading, setIsLoading] = useState(false);

    const directions = directionContext.directionList;
    const clearDirectionsCache = () => {
        setDirectionContext.setDirectionList(undefined);
    };

    const getDirections = useCallback(() => {
        setIsLoading(true);
        DirectionAPI.list()
            .then(res => {
                setDirectionContext.setDirectionList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setDirectionContext]);

    const createDirection = (name: string, description: string | null, category_id: string | null) => {
        DirectionAPI.create({ name, description, category_id }).then(res => {
            getDirections();
        });
    };

    const updateDirection = (id: string, name: string, description: string | null, category_id: string | null) => {
        DirectionAPI.update(id, { name, description, category_id }).then(res => {
            getDirections();
        });
    };

    const deleteDirection = (id: string) => {
        DirectionAPI.delete(id).then(_ => {
            getDirections();
        });
    };

    const archiveDirection = (id: string) => {
        DirectionAPI.archive(id).then(_ => {
            getDirections();
        });
    };

    const unarchiveDirection = (id: string) => {
        DirectionAPI.unarchive(id).then(_ => {
            getDirections();
        });
    };

    const bulkUpdateDirectionOrdering = async (ordering: string[]) => {
        await DirectionAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        directions,
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
