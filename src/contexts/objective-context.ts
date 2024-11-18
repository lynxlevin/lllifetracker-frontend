import { createContext } from 'react';
import type { Objective, ObjectiveWithLinks } from '../types/objective';

interface ObjectiveContextType {
    objectiveList: Objective[] | undefined;
    setObjectiveList: React.Dispatch<React.SetStateAction<Objective[] | undefined>>;
    objectivesWithLinksList: ObjectiveWithLinks[] | undefined;
    setObjectivesWithLinksList: React.Dispatch<React.SetStateAction<ObjectiveWithLinks[] | undefined>>;
}

export const ObjectiveContext = createContext({
    objectiveList: undefined,
    setObjectiveList: () => {},
    objectivesWithLinksList: undefined,
    setObjectivesWithLinksList: () => {},
} as ObjectiveContextType);
