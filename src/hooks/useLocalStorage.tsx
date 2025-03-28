const useLocalStorage = () => {
    const setActionTracksColumnsCount = (columnsCount: number) => {
        localStorage.setItem('actionTracksColumnsCount', String(columnsCount));
    };

    const getActionTracksColumnsCount = (): 1 | 2 => {
        return localStorage.getItem('actionTracksColumnsCount') === '2' ? 2 : 1;
    };

    return {
        setActionTracksColumnsCount,
        getActionTracksColumnsCount,
    };
};

export default useLocalStorage;
