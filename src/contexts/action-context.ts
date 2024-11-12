import { createContext } from 'react';
import type { Action } from '../types/action';

interface ActionContextType {
    actionList: Action[] | undefined;
    setActionList: React.Dispatch<React.SetStateAction<Action[] | undefined>>;
}

export const ActionContext = createContext({
    actionList: undefined,
    setActionList: () => {},
} as ActionContextType);
