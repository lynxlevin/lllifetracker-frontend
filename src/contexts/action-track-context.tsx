import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack } from '../types/action_track';

interface ActionTrackContextType {
    actionTrackList: ActionTrack[] | undefined;
    activeActionTrackList: ActionTrack[] | undefined;
}

interface SetActionTrackContextType {
    setActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
    setActiveActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    actionTrackList: undefined,
    activeActionTrackList: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActionTrackList: () => {},
    setActiveActionTrackList: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [actionTrackList, setActionTrackList] = useState<ActionTrack[]>();
    const [activeActionTrackList, setActiveActionTrackList] = useState<ActionTrack[]>();

    return (
        <ActionTrackContext.Provider value={{ actionTrackList, activeActionTrackList }}>
            <SetActionTrackContext.Provider value={{ setActionTrackList, setActiveActionTrackList }}>{children}</SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
