import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack, ActionTrackDailyAggregation } from '../types/action_track';

interface ActionTrackContextType {
    activeActionTrackList: ActionTrack[] | undefined;
    actionTracksForTheDay: ActionTrack[] | undefined;
    shouldRefreshActionTracksCache: boolean;
    dailyAggregation: ActionTrackDailyAggregation | undefined;
}

interface SetActionTrackContextType {
    setActiveActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setActionTracksForTheDay: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setShouldRefreshActionTracksCache: React.Dispatch<React.SetStateAction<boolean>>;
    setDailyAggregation: React.Dispatch<React.SetStateAction<ActionTrackDailyAggregation | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    activeActionTrackList: undefined,
    actionTracksForTheDay: undefined,
    shouldRefreshActionTracksCache: false,
    dailyAggregation: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActiveActionTrackList: () => {},
    setActionTracksForTheDay: () => {},
    setShouldRefreshActionTracksCache: () => {},
    setDailyAggregation: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [activeActionTrackList, setActiveActionTrackList] = useState<ActionTrack[]>();
    const [actionTracksForTheDay, setActionTracksForTheDay] = useState<ActionTrack[]>();
    const [dailyAggregation, setDailyAggregation] = useState<ActionTrackDailyAggregation>();
    const [shouldRefreshActionTracksCache, setShouldRefreshActionTracksCache] = useState(false);

    return (
        <ActionTrackContext.Provider value={{ activeActionTrackList, actionTracksForTheDay, shouldRefreshActionTracksCache, dailyAggregation }}>
            <SetActionTrackContext.Provider
                value={{ setActiveActionTrackList, setActionTracksForTheDay, setShouldRefreshActionTracksCache, setDailyAggregation }}
            >
                {children}
            </SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
