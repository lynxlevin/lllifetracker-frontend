import { createContext, useState, type ReactNode } from 'react';
import type { Action, ActionWithLinks } from '../types/action';

interface ActionContextType {
    actionList: Action[] | undefined;
    actionsWithLinksList: ActionWithLinks[] | undefined;
}

interface SetActionContextType {
    setActionList: React.Dispatch<React.SetStateAction<Action[] | undefined>>;
    setActionsWithLinksList: React.Dispatch<React.SetStateAction<ActionWithLinks[] | undefined>>;
}

export const ActionContext = createContext<ActionContextType>({
    actionList: undefined,
    actionsWithLinksList: undefined,
});

export const SetActionContext = createContext<SetActionContextType>({
    setActionList: () => {},
    setActionsWithLinksList: () => {},
});

export const ActionProvider = ({ children }: { children: ReactNode }) => {
    const [actionList, setActionList] = useState<Action[]>();
    const [actionsWithLinksList, setActionsWithLinksList] = useState<ActionWithLinks[]>();

    return (
        <ActionContext.Provider value={{ actionList, actionsWithLinksList }}>
            <SetActionContext.Provider value={{ setActionList, setActionsWithLinksList }}>{children}</SetActionContext.Provider>
        </ActionContext.Provider>
    );
};
