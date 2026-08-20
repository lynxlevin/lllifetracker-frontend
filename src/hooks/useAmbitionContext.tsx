import { useCallback, useContext, useState } from 'react';
import { AmbitionContext, SetAmbitionContext } from '../contexts/ambition-context';
import { AmbitionAPI } from '../apis/AmbitionAPI';
import useTagContext from './useTagContext';
import useGlobalErrorContext from './useGlobalErrorContext';

const useAmbitionContext = () => {
    const ambitionContext = useContext(AmbitionContext);
    const setAmbitionContext = useContext(SetAmbitionContext);
    const { getTags } = useTagContext();
    const { handleAPIError, handleAPIErrorThrowing } = useGlobalErrorContext();

    const [isLoading, setIsLoading] = useState(false);

    const ambitions = ambitionContext.ambitionList;
    const activeAmbitions = ambitionContext.ambitionList?.filter(ambition => !ambition.archived);
    const archivedAmbitions = ambitionContext.ambitionList?.filter(ambition => ambition.archived);

    const clearAmbitionsCache = () => {
        setAmbitionContext.setAmbitionList(undefined);
    };

    const getAmbitions = useCallback(() => {
        setIsLoading(true);
        AmbitionAPI.list()
            .then(res => {
                setAmbitionContext.setAmbitionList(res.data);
            })
            .catch(handleAPIError)
            .finally(() => {
                setIsLoading(false);
            });
    }, [handleAPIError, setAmbitionContext]);

    const createAmbition = async (name: string, description: string | null) => {
        await AmbitionAPI.create({ name, description })
            .then(_ => {
                getAmbitions();
                getTags();
            })
            .catch(handleAPIErrorThrowing);
    };

    const updateAmbition = async (id: string, name: string, description: string | null) => {
        await AmbitionAPI.update(id, { name, description })
            .then(_ => {
                getAmbitions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const deleteAmbition = async (id: string) => {
        await AmbitionAPI.delete(id)
            .then(_ => {
                getAmbitions();
                getTags();
            })
            .catch(handleAPIErrorThrowing);
    };

    const archiveAmbition = async (id: string) => {
        await AmbitionAPI.archive(id)
            .then(_ => {
                getAmbitions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const unarchiveAmbition = async (id: string) => {
        await AmbitionAPI.unarchive(id)
            .then(_ => {
                getAmbitions();
            })
            .catch(handleAPIErrorThrowing);
    };

    const bulkUpdateAmbitionOrdering = async (ordering: string[]) => {
        await AmbitionAPI.bulk_update_ordering(ordering).catch(handleAPIErrorThrowing);
    };

    return {
        isLoading,
        ambitions,
        activeAmbitions,
        archivedAmbitions,
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
