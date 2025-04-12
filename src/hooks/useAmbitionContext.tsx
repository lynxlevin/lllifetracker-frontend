import { useCallback, useContext, useState } from 'react';
import { AmbitionContext, SetAmbitionContext } from '../contexts/ambition-context';
import { AmbitionAPI } from '../apis/AmbitionAPI';

const useAmbitionContext = () => {
    const ambitionContext = useContext(AmbitionContext);
    const setAmbitionContext = useContext(SetAmbitionContext);

    const [isLoading, setIsLoading] = useState(false);

    const ambitions = ambitionContext.ambitionList;
    const clearAmbitionsCache = () => {
        setAmbitionContext.setAmbitionList(undefined);
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

    const createAmbition = (name: string, description: string | null) => {
        AmbitionAPI.create({ name, description }).then(_ => {
            getAmbitions();
        });
    };

    const updateAmbition = (id: string, name: string, description: string | null) => {
        AmbitionAPI.update(id, { name, description }).then(_ => {
            getAmbitions();
        });
    };

    const deleteAmbition = (id: string) => {
        AmbitionAPI.delete(id).then(_ => {
            getAmbitions();
        });
    };

    const archiveAmbition = (id: string) => {
        AmbitionAPI.archive(id).then(_ => {
            getAmbitions();
        });
    };

    const unarchiveAmbition = (id: string) => {
        AmbitionAPI.unarchive(id).then(_ => {
            getAmbitions();
        });
    };

    const bulkUpdateAmbitionOrdering = async (ordering: string[]) => {
        await AmbitionAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        ambitions,
        clearAmbitionsCache,
        getAmbitions,
        createAmbition,
        updateAmbition,
        deleteAmbition,
        archiveAmbition,
        unarchiveAmbition,
        bulkUpdateAmbitionOrdering,
    };
};

export default useAmbitionContext;
