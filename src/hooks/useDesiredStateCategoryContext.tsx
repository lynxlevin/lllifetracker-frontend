import { useCallback, useContext, useMemo, useState } from 'react';
import { DesiredStateCategoryAPI } from '../apis/DesiredStateCategoryAPI';
import { DesiredStateCategoryContext, SetDesiredStateCategoryContext } from '../contexts/desired-state-category-context';
import type { DesiredState, DesiredStateCategory } from '../types/my_way';

const useDesiredStateCategoryContext = () => {
    const desiredStateCategoryContext = useContext(DesiredStateCategoryContext);
    const setDesiredStateCategoryContext = useContext(SetDesiredStateCategoryContext);

    const [isLoading, setIsLoading] = useState(false);

    const desiredStateCategories = desiredStateCategoryContext.desiredStateCategoryList;
    const clearDesiredStateCategoriesCache = () => {
        setDesiredStateCategoryContext.setDesiredStateCategoryList(undefined);
    };

    const categoryMap = useMemo(() => {
        const map = new Map<string | null, DesiredStateCategory>();
        if (desiredStateCategories === undefined) return map;
        for (const category of desiredStateCategories) {
            map.set(category.id, category);
        }
        return map;
    }, [desiredStateCategories]);

    const categoryIndexMap = useMemo(() => {
        const map = new Map<string | null, number>();
        desiredStateCategories?.forEach((cat, idx) => map.set(cat.id, idx));
        map.set(null, desiredStateCategories?.length ?? 0);
        return map;
    }, [desiredStateCategories]);

    const cmpDesiredStatesByCategory = (a: DesiredState, b: DesiredState) => {
        if (a.category_id === null && b.category_id === null) return 0;
        if (a.category_id === null) return 1;
        if (b.category_id === null) return -1;
        return categoryIndexMap.get(a.category_id)! - categoryIndexMap.get(b.category_id)!;
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
        categoryMap,
        cmpDesiredStatesByCategory,
        getDesiredStateCategories,
        createDesiredStateCategory,
        updateDesiredStateCategory,
        deleteDesiredStateCategory,
        bulkUpdateDesiredStateCategoryOrdering,
    };
};

export default useDesiredStateCategoryContext;
