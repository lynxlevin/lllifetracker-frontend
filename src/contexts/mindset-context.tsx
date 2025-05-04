import { createContext, useState, type ReactNode } from 'react';
import type { Mindset } from '../types/my_way';

interface MindsetContextType {
    mindsetList: Mindset[] | undefined;
}

interface SetMindsetContextType {
    setMindsetList: React.Dispatch<React.SetStateAction<Mindset[] | undefined>>;
}

export const MindsetContext = createContext<MindsetContextType>({
    mindsetList: undefined,
});

export const SetMindsetContext = createContext<SetMindsetContextType>({
    setMindsetList: () => {},
});

export const MindsetProvider = ({ children }: { children: ReactNode }) => {
    const [mindsetList, setMindsetList] = useState<Mindset[]>();

    return (
        <MindsetContext.Provider value={{ mindsetList }}>
            <SetMindsetContext.Provider value={{ setMindsetList }}>{children}</SetMindsetContext.Provider>
        </MindsetContext.Provider>
    );
};
