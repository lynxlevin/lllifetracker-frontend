import { createContext } from 'react';
import type { Action, ActionWithLinks } from '../types/action';

interface ActionContextType {
    actionList: Action[] | undefined;
    setActionList: React.Dispatch<React.SetStateAction<Action[] | undefined>>;
    actionsWithLinksList: ActionWithLinks[] | undefined;
    setActionsWithLinksList: React.Dispatch<React.SetStateAction<ActionWithLinks[] | undefined>>;
}

export const ActionContext = createContext({
    actionList: undefined,
    setActionList: () => {},
    actionsWithLinksList: undefined,
    setActionsWithLinksList: () => {},
} as ActionContextType);
