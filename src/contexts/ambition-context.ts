import { createContext } from 'react';
import type { AmbitionWithLinks } from '../types/ambition';

interface AmbitionContextType {
    ambitionWithLinksList: AmbitionWithLinks[] | undefined;
    setAmbitionWithLinksList: React.Dispatch<React.SetStateAction<AmbitionWithLinks[] | undefined>>;
}

export const AmbitionContext = createContext({
    ambitionWithLinksList: undefined,
    setAmbitionWithLinksList: () => {},
} as AmbitionContextType);
