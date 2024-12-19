import { createContext } from 'react';
import type { MissionMemo } from '../types/mission_memo';

interface MissionMemoContextType {
    missionMemoList: MissionMemo[] | undefined;
    setMissionMemoList: React.Dispatch<React.SetStateAction<MissionMemo[] | undefined>>;
}

export const MissionMemoContext = createContext({
    missionMemoList: undefined,
    setMissionMemoList: () => {},
} as MissionMemoContextType);
