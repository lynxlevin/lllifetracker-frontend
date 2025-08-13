import { createContext, useState, type ReactNode } from 'react';
import type { ActionWithGoal } from '../types/my_way';

interface ActionContextType {
    actionList: ActionWithGoal[] | undefined;
}

interface SetActionContextType {
    setActionList: React.Dispatch<React.SetStateAction<ActionWithGoal[] | undefined>>;
}

export const ActionContext = createContext<ActionContextType>({
    actionList: undefined,
});

export const SetActionContext = createContext<SetActionContextType>({
    setActionList: () => {},
});

export const ActionProvider = ({ children }: { children: ReactNode }) => {
    const [actionList, setActionList] = useState<ActionWithGoal[]>();

    return (
        <ActionContext.Provider value={{ actionList }}>
            <SetActionContext.Provider value={{ setActionList }}>{children}</SetActionContext.Provider>
        </ActionContext.Provider>
    );
};
