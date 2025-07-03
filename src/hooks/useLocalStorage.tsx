const LOCAL_STORAGE_KEYS = {
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
    selectedDesiredStateCategoryId: 'selectedDesiredStateCategoryId',
    weeklyAggregationSelectedActionId: 'weeklyAggregationSelectedActionId',
    monthlyAggregationSelectedActionId: 'monthlyAggregationSelectedActionId',
};

const useLocalStorage = () => {
    const setActionTracksColumnsCount = (columnsCount: number) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount, String(columnsCount));
    };

    const getActionTracksColumnsCount = (): 1 | 2 | 3 => {
        const value = localStorage.getItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount);
        if (value === '2') return 2;
        if (value === '3') return 3;
        return 1;
    };

    const setSelectedCategoryId = (categoryId: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.selectedDesiredStateCategoryId, categoryId);
    };

    const getSelectedCategoryId = () => {
        const res = localStorage.getItem(LOCAL_STORAGE_KEYS.selectedDesiredStateCategoryId);
        return res === '' ? null : res;
    };

    const setWeeklyAggSelectedActionId = (actionId: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.weeklyAggregationSelectedActionId, actionId);
    };

    const getWeeklyAggSelectedActionId = () => {
        const res = localStorage.getItem(LOCAL_STORAGE_KEYS.weeklyAggregationSelectedActionId);
        return res === '' ? null : res;
    };

    const setMonthlyAggSelectedActionId = (actionId: string) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.monthlyAggregationSelectedActionId, actionId);
    };

    const getMonthlyAggSelectedActionId = () => {
        const res = localStorage.getItem(LOCAL_STORAGE_KEYS.monthlyAggregationSelectedActionId);
        return res === '' ? null : res;
    };

    return {
        setActionTracksColumnsCount,
        getActionTracksColumnsCount,
        setSelectedCategoryId,
        getSelectedCategoryId,
        setWeeklyAggSelectedActionId,
        getWeeklyAggSelectedActionId,
        setMonthlyAggSelectedActionId,
        getMonthlyAggSelectedActionId,
    };
};

export default useLocalStorage;
