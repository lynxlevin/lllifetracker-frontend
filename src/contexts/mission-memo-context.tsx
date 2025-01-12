import { createContext, useState, type ReactNode } from 'react';
import type { MissionMemo } from '../types/mission_memo';

interface MissionMemoContextType {
    missionMemoList: MissionMemo[] | undefined;
}

interface SetMissionMemoContextType {
    setMissionMemoList: React.Dispatch<React.SetStateAction<MissionMemo[] | undefined>>;
}

export const MissionMemoContext = createContext<MissionMemoContextType>({
    missionMemoList: undefined,
});

export const SetMissionMemoContext = createContext<SetMissionMemoContextType>({
    setMissionMemoList: () => {},
});

export const MissionMemoProvider = ({ children }: { children: ReactNode }) => {
    const [missionMemoList, setMissionMemoList] = useState<MissionMemo[]>();

    return (
        <MissionMemoContext.Provider value={{ missionMemoList }}>
            <SetMissionMemoContext.Provider value={{ setMissionMemoList }}>{children}</SetMissionMemoContext.Provider>
        </MissionMemoContext.Provider>
    );
};
