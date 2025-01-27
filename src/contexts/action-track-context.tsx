import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack, ActionTrackAggregation } from '../types/action_track';

interface ActionTrackContextType {
    actionTracksByDate: ActionTrack[][] | undefined;
    activeActionTrackList: ActionTrack[] | undefined;
    dailyAggregation: ActionTrackAggregation | undefined;
}

interface SetActionTrackContextType {
    setActionTracksByDate: React.Dispatch<React.SetStateAction<ActionTrack[][] | undefined>>;
    setActiveActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setDailyAggregation: React.Dispatch<React.SetStateAction<ActionTrackAggregation | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    actionTracksByDate: undefined,
    activeActionTrackList: undefined,
    dailyAggregation: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActionTracksByDate: () => {},
    setActiveActionTrackList: () => {},
    setDailyAggregation: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [actionTracksByDate, setActionTracksByDate] = useState<ActionTrack[][]>();
    const [activeActionTrackList, setActiveActionTrackList] = useState<ActionTrack[]>();
    const [dailyAggregation, setDailyAggregation] = useState<ActionTrackAggregation>();

    return (
        <ActionTrackContext.Provider value={{ actionTracksByDate, activeActionTrackList, dailyAggregation }}>
            <SetActionTrackContext.Provider value={{ setActionTracksByDate, setActiveActionTrackList, setDailyAggregation }}>
                {children}
            </SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
