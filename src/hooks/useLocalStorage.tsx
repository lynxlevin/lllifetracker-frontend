const LOCAL_STORAGE_KEYS = {
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
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

    return {
        setActionTracksColumnsCount,
        getActionTracksColumnsCount,
    };
};

export default useLocalStorage;
