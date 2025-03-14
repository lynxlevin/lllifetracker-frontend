import { createContext, useState, type ReactNode } from 'react';
import type { DesiredState, DesiredStateWithLinks } from '../types/desired_state';

interface DesiredStateContextType {
    desiredStateList: DesiredState[] | undefined;
    desiredStatesWithLinksList: DesiredStateWithLinks[] | undefined;
}

interface SetDesiredStateContextType {
    setDesiredStateList: React.Dispatch<React.SetStateAction<DesiredState[] | undefined>>;
    setDesiredStatesWithLinksList: React.Dispatch<React.SetStateAction<DesiredStateWithLinks[] | undefined>>;
}

export const DesiredStateContext = createContext<DesiredStateContextType>({
    desiredStateList: undefined,
    desiredStatesWithLinksList: undefined,
});

export const SetDesiredStateContext = createContext<SetDesiredStateContextType>({
    setDesiredStateList: () => {},
    setDesiredStatesWithLinksList: () => {},
});

export const DesiredStateProvider = ({ children }: { children: ReactNode }) => {
    const [desiredStateList, setDesiredStateList] = useState<DesiredState[]>();
    const [desiredStatesWithLinksList, setDesiredStatesWithLinksList] = useState<DesiredStateWithLinks[]>();

    return (
        <DesiredStateContext.Provider value={{ desiredStateList, desiredStatesWithLinksList }}>
            <SetDesiredStateContext.Provider value={{ setDesiredStateList, setDesiredStatesWithLinksList }}>{children}</SetDesiredStateContext.Provider>
        </DesiredStateContext.Provider>
    );
};
