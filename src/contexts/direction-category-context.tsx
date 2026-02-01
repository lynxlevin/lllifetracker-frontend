import { createContext, useState, type ReactNode } from 'react';
import type { DirectionCategory } from '../types/my_way';

interface DirectionCategoryContextType {
    directionCategoryList: DirectionCategory[] | undefined;
}

interface SetDirectionCategoryContextType {
    setDirectionCategoryList: React.Dispatch<React.SetStateAction<DirectionCategory[] | undefined>>;
}

export const DirectionCategoryContext = createContext<DirectionCategoryContextType>({
    directionCategoryList: undefined,
});

export const SetDirectionCategoryContext = createContext<SetDirectionCategoryContextType>({
    setDirectionCategoryList: () => {},
});

export const DirectionCategoryProvider = ({ children }: { children: ReactNode }) => {
    const [directionCategoryList, setDirectionCategoryList] = useState<DirectionCategory[]>();

    return (
        <DirectionCategoryContext.Provider value={{ directionCategoryList }}>
            <SetDirectionCategoryContext.Provider value={{ setDirectionCategoryList }}>{children}</SetDirectionCategoryContext.Provider>
        </DirectionCategoryContext.Provider>
    );
};
