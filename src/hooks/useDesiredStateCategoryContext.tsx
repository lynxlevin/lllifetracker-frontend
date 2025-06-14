import { useCallback, useContext, useState } from 'react';
import { DesiredStateCategoryAPI } from '../apis/DesiredStateCategoryAPI';
import { DesiredStateCategoryContext, SetDesiredStateCategoryContext } from '../contexts/desired-state-category-context';

const useDesiredStateCategoryContext = () => {
    const desiredStateCategoryContext = useContext(DesiredStateCategoryContext);
    const setDesiredStateCategoryContext = useContext(SetDesiredStateCategoryContext);

    const [isLoading, setIsLoading] = useState(false);

    const desiredStateCategories = desiredStateCategoryContext.desiredStateCategoryList;
    const clearDesiredStateCategoriesCache = () => {
        setDesiredStateCategoryContext.setDesiredStateCategoryList(undefined);
    };

    const getDesiredStateCategories = useCallback(() => {
        setIsLoading(true);
        DesiredStateCategoryAPI.list()
            .then(res => {
                setDesiredStateCategoryContext.setDesiredStateCategoryList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setDesiredStateCategoryContext]);

    const createDesiredStateCategory = (name: string) => {
        DesiredStateCategoryAPI.create({ name }).then(res => {
            getDesiredStateCategories();
        });
    };

    const updateDesiredStateCategory = (id: string, name: string) => {
        DesiredStateCategoryAPI.update(id, { name }).then(res => {
            getDesiredStateCategories();
        });
    };

    const deleteDesiredStateCategory = (id: string) => {
        DesiredStateCategoryAPI.delete(id).then(_ => {
            getDesiredStateCategories();
        });
    };

    const bulkUpdateDesiredStateCategoryOrdering = async (ordering: string[]) => {
        await DesiredStateCategoryAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        desiredStateCategories,
        clearDesiredStateCategoriesCache,
        getDesiredStateCategories,
        createDesiredStateCategory,
        updateDesiredStateCategory,
        deleteDesiredStateCategory,
        bulkUpdateDesiredStateCategoryOrdering,
    };
};

export default useDesiredStateCategoryContext;
