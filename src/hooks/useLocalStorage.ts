const AMBITION_SETTINGS_KEY = 'ambitionSettings';
const OBJECTIVE_SETTINGS_KEY = 'objectiveSettings';
const ACTION_SETTINGS_KEY = 'actionSettings';
export interface AmbitionSettings {
    sort: string[];
}
export interface ObjectiveSettings {
    sort: string[];
}
export interface ActionSettings {
    sort: string[];
    disableTracking: string[];
}

const useLocalStorage = () => {
    const setAmbitionSettings = (ambitionSettings: AmbitionSettings) => {
        localStorage.setItem(AMBITION_SETTINGS_KEY, JSON.stringify(ambitionSettings));
    };
    const getAmbitionSettings = (): AmbitionSettings => {
        const ambitionSettings = localStorage.getItem(AMBITION_SETTINGS_KEY);
        if (ambitionSettings === null) return { sort: [] };
        return JSON.parse(ambitionSettings);
    };

    const setObjectiveSettings = (objectiveSettings: ObjectiveSettings) => {
        localStorage.setItem(OBJECTIVE_SETTINGS_KEY, JSON.stringify(objectiveSettings));
    };
    const getObjectiveSettings = (): ObjectiveSettings => {
        const objectiveSettings = localStorage.getItem(OBJECTIVE_SETTINGS_KEY);
        if (objectiveSettings === null) return { sort: [] };
        return JSON.parse(objectiveSettings);
    };

    const setActionSettings = (actionSettings: ActionSettings) => {
        localStorage.setItem(ACTION_SETTINGS_KEY, JSON.stringify(actionSettings));
    };
    const getActionSettings = (): ActionSettings => {
        const actionSettings = localStorage.getItem(ACTION_SETTINGS_KEY);
        if (actionSettings === null) return { sort: [], disableTracking: [] };
        return JSON.parse(actionSettings);
    };

    return {
        setAmbitionSettings,
        getAmbitionSettings,
        setObjectiveSettings,
        getObjectiveSettings,
        setActionSettings,
        getActionSettings,
    };
};

export default useLocalStorage;
