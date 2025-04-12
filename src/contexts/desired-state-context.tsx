import { createContext, useState, type ReactNode } from 'react';
import type { DesiredState } from '../types/my_way';

interface DesiredStateContextType {
    desiredStateList: DesiredState[] | undefined;
}

interface SetDesiredStateContextType {
    setDesiredStateList: React.Dispatch<React.SetStateAction<DesiredState[] | undefined>>;
}

export const DesiredStateContext = createContext<DesiredStateContextType>({
    desiredStateList: undefined,
});

export const SetDesiredStateContext = createContext<SetDesiredStateContextType>({
    setDesiredStateList: () => {},
});

export const DesiredStateProvider = ({ children }: { children: ReactNode }) => {
    const [desiredStateList, setDesiredStateList] = useState<DesiredState[]>();

    return (
        <DesiredStateContext.Provider value={{ desiredStateList }}>
            <SetDesiredStateContext.Provider value={{ setDesiredStateList }}>{children}</SetDesiredStateContext.Provider>
        </DesiredStateContext.Provider>
    );
};
