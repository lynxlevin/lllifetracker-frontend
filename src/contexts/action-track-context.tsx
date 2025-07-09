import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack, ActionTrackAggregation, ActionTrackDailyAggregation } from '../types/action_track';

interface ActionTrackContextType {
    activeActionTrackList: ActionTrack[] | undefined;
    actionTracksForTheDay: ActionTrack[] | undefined;
    aggregationForTheDay: ActionTrackAggregation | undefined;
    dailyAggregation: ActionTrackDailyAggregation | undefined;
}

interface SetActionTrackContextType {
    setActiveActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setActionTracksForTheDay: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setAggregationForTheDay: React.Dispatch<React.SetStateAction<ActionTrackAggregation | undefined>>;
    setDailyAggregation: React.Dispatch<React.SetStateAction<ActionTrackDailyAggregation | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    activeActionTrackList: undefined,
    actionTracksForTheDay: undefined,
    aggregationForTheDay: undefined,
    dailyAggregation: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActiveActionTrackList: () => {},
    setActionTracksForTheDay: () => {},
    setAggregationForTheDay: () => {},
    setDailyAggregation: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [activeActionTrackList, setActiveActionTrackList] = useState<ActionTrack[]>();
    const [actionTracksForTheDay, setActionTracksForTheDay] = useState<ActionTrack[]>();
    const [aggregationForTheDay, setAggregationForTheDay] = useState<ActionTrackAggregation>();
    const [dailyAggregation, setDailyAggregation] = useState<ActionTrackDailyAggregation>();

    return (
        <ActionTrackContext.Provider value={{ activeActionTrackList, actionTracksForTheDay, aggregationForTheDay, dailyAggregation }}>
            <SetActionTrackContext.Provider value={{ setActiveActionTrackList, setActionTracksForTheDay, setAggregationForTheDay, setDailyAggregation }}>
                {children}
            </SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
