import { createContext, useState, type ReactNode } from 'react';
import type { Ambition } from '../types/ambition';

interface AmbitionContextType {
    ambitionList: Ambition[] | undefined;
}

interface SetAmbitionContextType {
    setAmbitionList: React.Dispatch<React.SetStateAction<Ambition[] | undefined>>;
}

export const AmbitionContext = createContext<AmbitionContextType>({
    ambitionList: undefined,
});

export const SetAmbitionContext = createContext<SetAmbitionContextType>({
    setAmbitionList: () => {},
});

export const AmbitionProvider = ({ children }: { children: ReactNode }) => {
    const [ambitionList, setAmbitionList] = useState<Ambition[]>();

    return (
        <AmbitionContext.Provider value={{ ambitionList }}>
            <SetAmbitionContext.Provider value={{ setAmbitionList }}>{children}</SetAmbitionContext.Provider>
        </AmbitionContext.Provider>
    );
};
