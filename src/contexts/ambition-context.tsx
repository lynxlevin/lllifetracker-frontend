import { createContext, useState, type ReactNode } from 'react';
import type { AmbitionWithLinks } from '../types/ambition';

interface AmbitionContextType {
    ambitionWithLinksList: AmbitionWithLinks[] | undefined;
}

interface SetAmbitionContextType {
    setAmbitionWithLinksList: React.Dispatch<React.SetStateAction<AmbitionWithLinks[] | undefined>>;
}

export const AmbitionContext = createContext<AmbitionContextType>({
    ambitionWithLinksList: undefined,
});

export const SetAmbitionContext = createContext<SetAmbitionContextType>({
    setAmbitionWithLinksList: () => {},
});

export const AmbitionProvider = ({ children }: { children: ReactNode }) => {
    const [ambitionWithLinksList, setAmbitionWithLinksList] = useState<AmbitionWithLinks[]>();

    return (
        <AmbitionContext.Provider value={{ ambitionWithLinksList }}>
            <SetAmbitionContext.Provider value={{ setAmbitionWithLinksList }}>{children}</SetAmbitionContext.Provider>
        </AmbitionContext.Provider>
    );
};
