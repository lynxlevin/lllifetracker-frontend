import { createContext, useState, type ReactNode } from 'react';
import type { ThinkingNote } from '../types/journal';

interface ThinkingNotesByType {
    active: ThinkingNote[] | undefined;
    resolved: ThinkingNote[] | undefined;
}

interface ThinkingNoteContextType {
    thinkingNotes: ThinkingNotesByType;
}

interface SetThinkingNoteContextType {
    setThinkingNotes: React.Dispatch<React.SetStateAction<ThinkingNotesByType>>;
}

export const ThinkingNoteContext = createContext<ThinkingNoteContextType>({
    thinkingNotes: { active: undefined, resolved: undefined },
});

export const SetThinkingNoteContext = createContext<SetThinkingNoteContextType>({
    setThinkingNotes: () => {},
});

export const ThinkingNoteProvider = ({ children }: { children: ReactNode }) => {
    const [thinkingNotes, setThinkingNotes] = useState<ThinkingNotesByType>({ active: undefined, resolved: undefined });

    return (
        <ThinkingNoteContext.Provider value={{ thinkingNotes }}>
            <SetThinkingNoteContext.Provider value={{ setThinkingNotes }}>{children}</SetThinkingNoteContext.Provider>
        </ThinkingNoteContext.Provider>
    );
};
