import { createContext, useState, type ReactNode } from 'react';
import type { ActionTrack } from '../types/action_track';

interface ActionTrackContextType {
    actionTrackList: ActionTrack[] | undefined;
}

interface SetActionTrackContextType {
    setActionTrackList: React.Dispatch<React.SetStateAction<ActionTrack[] | undefined>>;
}

export const ActionTrackContext = createContext<ActionTrackContextType>({
    actionTrackList: undefined,
});

export const SetActionTrackContext = createContext<SetActionTrackContextType>({
    setActionTrackList: () => {},
});

export const ActionTrackProvider = ({ children }: { children: ReactNode }) => {
    const [actionTrackList, setActionTrackList] = useState<ActionTrack[]>();

    return (
        <ActionTrackContext.Provider value={{ actionTrackList }}>
            <SetActionTrackContext.Provider value={{ setActionTrackList }}>{children}</SetActionTrackContext.Provider>
        </ActionTrackContext.Provider>
    );
};
