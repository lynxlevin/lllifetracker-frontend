import { createContext, useState, type ReactNode } from 'react';
import type { Challenge } from '../types/challenge';

interface ChallengeContextType {
    challengeList: Challenge[] | undefined;
}

interface SetChallengeContextType {
    setChallengeList: React.Dispatch<React.SetStateAction<Challenge[] | undefined>>;
}

export const ChallengeContext = createContext<ChallengeContextType>({
    challengeList: undefined,
});

export const SetChallengeContext = createContext<SetChallengeContextType>({
    setChallengeList: () => {},
});

export const ChallengeProvider = ({ children }: { children: ReactNode }) => {
    const [challengeList, setChallengeList] = useState<Challenge[]>();

    return (
        <ChallengeContext.Provider value={{ challengeList }}>
            <SetChallengeContext.Provider value={{ setChallengeList }}>{children}</SetChallengeContext.Provider>
        </ChallengeContext.Provider>
    );
};
