import { useCallback, useContext, useState } from 'react';
import { MindsetContext, SetMindsetContext } from '../contexts/mindset-context';
import { MindsetAPI } from '../apis/MindsetAPI';

const useMindsetContext = () => {
    const mindsetContext = useContext(MindsetContext);
    const setMindsetContext = useContext(SetMindsetContext);

    const [isLoading, setIsLoading] = useState(false);

    const mindsets = mindsetContext.mindsetList;
    const clearMindsetsCache = () => {
        setMindsetContext.setMindsetList(undefined);
    };

    const getMindsets = useCallback(() => {
        setIsLoading(true);
        MindsetAPI.list()
            .then(res => {
                setMindsetContext.setMindsetList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setMindsetContext]);

    const createMindset = (name: string, description: string | null) => {
        MindsetAPI.create({ name, description }).then(_ => {
            getMindsets();
        });
    };

    const updateMindset = (id: string, name: string, description: string | null) => {
        MindsetAPI.update(id, { name, description }).then(_ => {
            getMindsets();
        });
    };

    const deleteMindset = (id: string) => {
        MindsetAPI.delete(id).then(_ => {
            getMindsets();
        });
    };

    const archiveMindset = (id: string) => {
        MindsetAPI.archive(id).then(_ => {
            getMindsets();
        });
    };

    const unarchiveMindset = (id: string) => {
        MindsetAPI.unarchive(id).then(_ => {
            getMindsets();
        });
    };

    const bulkUpdateMindsetOrdering = async (ordering: string[]) => {
        await MindsetAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        mindsets,
        clearMindsetsCache,
        getMindsets,
        createMindset,
        updateMindset,
        deleteMindset,
        archiveMindset,
        unarchiveMindset,
        bulkUpdateMindsetOrdering,
    };
};

export default useMindsetContext;
