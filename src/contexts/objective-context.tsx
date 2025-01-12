import { createContext, useState, type ReactNode } from 'react';
import type { Objective, ObjectiveWithLinks } from '../types/objective';

interface ObjectiveContextType {
    objectiveList: Objective[] | undefined;
    objectivesWithLinksList: ObjectiveWithLinks[] | undefined;
}

interface SetObjectiveContextType {
    setObjectiveList: React.Dispatch<React.SetStateAction<Objective[] | undefined>>;
    setObjectivesWithLinksList: React.Dispatch<React.SetStateAction<ObjectiveWithLinks[] | undefined>>;
}

export const ObjectiveContext = createContext<ObjectiveContextType>({
    objectiveList: undefined,
    objectivesWithLinksList: undefined,
});

export const SetObjectiveContext = createContext<SetObjectiveContextType>({
    setObjectiveList: () => {},
    setObjectivesWithLinksList: () => {},
});

export const ObjectiveProvider = ({ children }: { children: ReactNode }) => {
    const [objectiveList, setObjectiveList] = useState<Objective[]>();
    const [objectivesWithLinksList, setObjectivesWithLinksList] = useState<ObjectiveWithLinks[]>();

    return (
        <ObjectiveContext.Provider value={{ objectiveList, objectivesWithLinksList }}>
            <SetObjectiveContext.Provider value={{ setObjectiveList, setObjectivesWithLinksList }}>{children}</SetObjectiveContext.Provider>
        </ObjectiveContext.Provider>
    );
};
