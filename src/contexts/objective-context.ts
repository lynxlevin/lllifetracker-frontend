import { createContext } from 'react';
import type { Objective } from '../types/objective';

interface ObjectiveContextType {
    objectiveList: Objective[] | undefined;
    setObjectiveList: React.Dispatch<React.SetStateAction<Objective[] | undefined>>;
}

export const ObjectiveContext = createContext({
    objectiveList: undefined,
    setObjectiveList: () => {},
} as ObjectiveContextType);
