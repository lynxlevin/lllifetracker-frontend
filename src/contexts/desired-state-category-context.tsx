import { createContext, useState, type ReactNode } from 'react';
import type { DesiredStateCategory } from '../types/my_way';

interface DesiredStateCategoryContextType {
    desiredStateCategoryList: DesiredStateCategory[] | undefined;
}

interface SetDesiredStateCategoryContextType {
    setDesiredStateCategoryList: React.Dispatch<React.SetStateAction<DesiredStateCategory[] | undefined>>;
}

export const DesiredStateCategoryContext = createContext<DesiredStateCategoryContextType>({
    desiredStateCategoryList: undefined,
});

export const SetDesiredStateCategoryContext = createContext<SetDesiredStateCategoryContextType>({
    setDesiredStateCategoryList: () => {},
});

export const DesiredStateCategoryProvider = ({ children }: { children: ReactNode }) => {
    const [desiredStateCategoryList, setDesiredStateCategoryList] = useState<DesiredStateCategory[]>();

    return (
        <DesiredStateCategoryContext.Provider value={{ desiredStateCategoryList }}>
            <SetDesiredStateCategoryContext.Provider value={{ setDesiredStateCategoryList }}>{children}</SetDesiredStateCategoryContext.Provider>
        </DesiredStateCategoryContext.Provider>
    );
};
