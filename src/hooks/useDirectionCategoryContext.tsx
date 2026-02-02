import { useCallback, useContext, useMemo, useState } from 'react';
import { DirectionCategoryAPI } from '../apis/DirectionCategoryAPI';
import { DirectionCategoryContext, SetDirectionCategoryContext } from '../contexts/direction-category-context';
import type { Direction, DirectionCategory } from '../types/my_way';

const useDirectionCategoryContext = () => {
    const directionCategoryContext = useContext(DirectionCategoryContext);
    const setDirectionCategoryContext = useContext(SetDirectionCategoryContext);

    const [isLoading, setIsLoading] = useState(false);

    const directionCategories = directionCategoryContext.directionCategoryList;
    const clearDirectionCategoriesCache = () => {
        setDirectionCategoryContext.setDirectionCategoryList(undefined);
    };

    const categoryMap = useMemo(() => {
        const map = new Map<string | null, DirectionCategory>();
        if (directionCategories === undefined) return map;
        for (const category of directionCategories) {
            map.set(category.id, category);
        }
        return map;
    }, [directionCategories]);

    const categoryIndexMap = useMemo(() => {
        const map = new Map<string | null, number>();
        directionCategories?.forEach((cat, idx) => map.set(cat.id, idx));
        map.set(null, directionCategories?.length ?? 0);
        return map;
    }, [directionCategories]);

    const cmpDirectionsByCategory = (a: Direction, b: Direction) => {
        if (a.category_id === null && b.category_id === null) return 0;
        if (a.category_id === null) return 1;
        if (b.category_id === null) return -1;
        return categoryIndexMap.get(a.category_id)! - categoryIndexMap.get(b.category_id)!;
    };

    const getDirectionCategories = useCallback(() => {
        setIsLoading(true);
        DirectionCategoryAPI.list()
            .then(res => {
                setDirectionCategoryContext.setDirectionCategoryList(res.data);
            })
            .catch(e => {
                console.error(e);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setDirectionCategoryContext]);

    const createDirectionCategory = (name: string) => {
        DirectionCategoryAPI.create({ name }).then(res => {
            getDirectionCategories();
        });
    };

    const updateDirectionCategory = (id: string, name: string) => {
        DirectionCategoryAPI.update(id, { name }).then(res => {
            getDirectionCategories();
        });
    };

    const deleteDirectionCategory = (id: string) => {
        DirectionCategoryAPI.delete(id).then(_ => {
            getDirectionCategories();
        });
    };

    const bulkUpdateDirectionCategoryOrdering = async (ordering: string[]) => {
        await DirectionCategoryAPI.bulk_update_ordering(ordering);
    };

    return {
        isLoading,
        directionCategories,
        clearDirectionCategoriesCache,
        categoryMap,
        cmpDirectionsByCategory,
        getDirectionCategories,
        createDirectionCategory,
        updateDirectionCategory,
        deleteDirectionCategory,
        bulkUpdateDirectionCategoryOrdering,
    };
};

export default useDirectionCategoryContext;
