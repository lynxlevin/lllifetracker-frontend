const LOCAL_STORAGE_KEYS = {
    actionTracksButtonsColumnsCount: 'actionTracksButtonsColumnsCount',
};

const useLocalStorage = () => {
    const setActionTracksColumnsCount = (columnsCount: number) => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount, String(columnsCount));
        localStorage.removeItem('actionTracksColumnsCount');
    };

    const getActionTracksColumnsCount = (): 1 | 2 => {
        return localStorage.getItem(LOCAL_STORAGE_KEYS.actionTracksButtonsColumnsCount) === '2' ? 2 : 1;
    };

    return {
        setActionTracksColumnsCount,
        getActionTracksColumnsCount,
    };
};

export default useLocalStorage;
