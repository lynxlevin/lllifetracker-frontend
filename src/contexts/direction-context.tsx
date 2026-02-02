import { createContext, useState, type ReactNode } from 'react';
import type { Direction } from '../types/my_way';

interface DirectionContextType {
    directionList: Direction[] | undefined;
}

interface SetDirectionContextType {
    setDirectionList: React.Dispatch<React.SetStateAction<Direction[] | undefined>>;
}

export const DirectionContext = createContext<DirectionContextType>({
    directionList: undefined,
});

export const SetDirectionContext = createContext<SetDirectionContextType>({
    setDirectionList: () => {},
});

export const DirectionProvider = ({ children }: { children: ReactNode }) => {
    const [directionList, setDirectionList] = useState<Direction[]>();

    return (
        <DirectionContext.Provider value={{ directionList }}>
            <SetDirectionContext.Provider value={{ setDirectionList }}>{children}</SetDirectionContext.Provider>
        </DirectionContext.Provider>
    );
};
