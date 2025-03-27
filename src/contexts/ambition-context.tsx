import { createContext, useState, type ReactNode } from 'react';
import type { Ambition, AmbitionWithLinks } from '../types/ambition';

interface AmbitionContextType {
    ambitionList: Ambition[] | undefined;
    ambitionWithLinksList: AmbitionWithLinks[] | undefined;
}

interface SetAmbitionContextType {
    setAmbitionList: React.Dispatch<React.SetStateAction<Ambition[] | undefined>>;
    setAmbitionWithLinksList: React.Dispatch<React.SetStateAction<AmbitionWithLinks[] | undefined>>;
}

export const AmbitionContext = createContext<AmbitionContextType>({
    ambitionList: undefined,
    ambitionWithLinksList: undefined,
});

export const SetAmbitionContext = createContext<SetAmbitionContextType>({
    setAmbitionList: () => {},
    setAmbitionWithLinksList: () => {},
});

export const AmbitionProvider = ({ children }: { children: ReactNode }) => {
    const [ambitionList, setAmbitionList] = useState<Ambition[]>();
    const [ambitionWithLinksList, setAmbitionWithLinksList] = useState<AmbitionWithLinks[]>();

    return (
        <AmbitionContext.Provider value={{ ambitionList, ambitionWithLinksList }}>
            <SetAmbitionContext.Provider value={{ setAmbitionList, setAmbitionWithLinksList }}>{children}</SetAmbitionContext.Provider>
        </AmbitionContext.Provider>
    );
};
