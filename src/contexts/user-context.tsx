import { createContext, useState, type ReactNode } from 'react';
import type { User } from '../types/user';

interface UserContextType {
    user: User | undefined;
}

interface SetUserContextType {
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const UserContext = createContext<UserContextType>({
    user: undefined,
});

export const SetUserContext = createContext<SetUserContextType>({
    setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>();

    return (
        <UserContext.Provider value={{ user }}>
            <SetUserContext.Provider value={{ setUser }}>{children}</SetUserContext.Provider>
        </UserContext.Provider>
    );
};
