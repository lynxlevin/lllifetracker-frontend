import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack, ActionTrackAggregation } from '../types/action_track';

interface ActionTrackContextType {
    activeActionTrackList: ActionTrack[] | undefined;
    createdTrackActionIdList: string[];
    actionTracksForTheDay: ActionTrack[] | undefined;
    dailyAggregation: ActionTrackAggregation | undefined;
}

interface SetActionTrackContextType {
    setActiveActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setCreatedTrackActionIdList: React.Dispatch<React.SetStateAction<string[]>>;
    setActionTracksForTheDay: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setDailyAggregation: React.Dispatch<React.SetStateAction<ActionTrackAggregation | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    activeActionTrackList: undefined,
    createdTrackActionIdList: [],
    actionTracksForTheDay: undefined,
    dailyAggregation: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActiveActionTrackList: () => {},
    setCreatedTrackActionIdList: () => {},
    setActionTracksForTheDay: () => {},
    setDailyAggregation: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [activeActionTrackList, setActiveActionTrackList] = useState<ActionTrack[]>();
    const [createdTrackActionIdList, setCreatedTrackActionIdList] = useState<string[]>([]);
    const [actionTracksForTheDay, setActionTracksForTheDay] = useState<ActionTrack[]>();
    const [dailyAggregation, setDailyAggregation] = useState<ActionTrackAggregation>();

    return (
        <ActionTrackContext.Provider value={{ activeActionTrackList, createdTrackActionIdList, actionTracksForTheDay, dailyAggregation }}>
            <SetActionTrackContext.Provider value={{ setActiveActionTrackList, setCreatedTrackActionIdList, setActionTracksForTheDay, setDailyAggregation }}>
                {children}
            </SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
