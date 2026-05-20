import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack, ActionTrackDailyAggregation } from '../types/action_track';

interface ActionTrackContextType {
    activeActionTrackList: ActionTrack[] | undefined;
    actionTracksForTheDay: ActionTrack[] | undefined;
    dailyAggregation: ActionTrackDailyAggregation | undefined;
}

interface SetActionTrackContextType {
    setActiveActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setActionTracksForTheDay: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setDailyAggregation: React.Dispatch<React.SetStateAction<ActionTrackDailyAggregation | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    activeActionTrackList: undefined,
    actionTracksForTheDay: undefined,
    dailyAggregation: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActiveActionTrackList: () => {},
    setActionTracksForTheDay: () => {},
    setDailyAggregation: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [activeActionTrackList, setActiveActionTrackList] = useState<ActionTrack[]>();
    const [actionTracksForTheDay, setActionTracksForTheDay] = useState<ActionTrack[]>();
    const [dailyAggregation, setDailyAggregation] = useState<ActionTrackDailyAggregation>();

    return (
        <ActionTrackContext.Provider value={{ activeActionTrackList, actionTracksForTheDay, dailyAggregation }}>
            <SetActionTrackContext.Provider value={{ setActiveActionTrackList, setActionTracksForTheDay, setDailyAggregation }}>
                {children}
            </SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
