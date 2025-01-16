import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack } from '../types/action_track';

interface ActionTrackContextType {
    actionTracksByDate: ActionTrack[][] | undefined;
    activeActionTrackList: ActionTrack[] | undefined;
}

interface SetActionTrackContextType {
    setActionTracksByDate: React.Dispatch<React.SetStateAction<ActionTrack[][] | undefined>>;
    setActiveActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    actionTracksByDate: undefined,
    activeActionTrackList: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActionTracksByDate: () => {},
    setActiveActionTrackList: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [actionTracksByDate, setActionTracksByDate] = useState<ActionTrack[][]>();
    const [activeActionTrackList, setActiveActionTrackList] = useState<ActionTrack[]>();

    return (
        <ActionTrackContext.Provider value={{ actionTracksByDate, activeActionTrackList }}>
            <SetActionTrackContext.Provider value={{ setActionTracksByDate, setActiveActionTrackList }}>{children}</SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
