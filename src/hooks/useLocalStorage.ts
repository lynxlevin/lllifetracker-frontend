const AMBITION_SETTINGS_KEY = 'ambitionSettings';
const OBJECTIVE_SETTINGS_KEY = 'objectiveSettings';
const ACTION_SETTINGS_KEY = 'actionSettings';
interface AmbitionSettings {
    sort: string[];
}
interface ObjectiveSettings {
    sort: string[];
    disableTracking: string[];
}
interface ActionSettings {
    sort: string[];
    disableTracking: string[];
}

const useLocalStorage = () => {
    const setAmbitionSettings = (ambitionSettings: AmbitionSettings) => {
        localStorage.setItem(AMBITION_SETTINGS_KEY, JSON.stringify(ambitionSettings));
    };
    const getAmbitionSettings = () => {
        const ambitionSettings = localStorage.getItem(AMBITION_SETTINGS_KEY);
        if (ambitionSettings === null) return null;
        return JSON.parse(ambitionSettings);
    };

    const setObjectiveSettings = (objectiveSettings: ObjectiveSettings) => {
        localStorage.setItem(OBJECTIVE_SETTINGS_KEY, JSON.stringify(objectiveSettings));
    };
    const getObjectiveSettings = () => {
        const objectiveSettings = localStorage.getItem(OBJECTIVE_SETTINGS_KEY);
        if (objectiveSettings === null) return null;
        return JSON.parse(objectiveSettings);
    };

    const setActionSettings = (actionSettings: ActionSettings) => {
        localStorage.setItem(ACTION_SETTINGS_KEY, JSON.stringify(actionSettings));
    };
    const getActionSettings = () => {
        const actionSettings = localStorage.getItem(ACTION_SETTINGS_KEY);
        if (actionSettings === null) return null;
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
