import { createContext } from 'react';
import type { User } from '../types/user';

interface CurrentUserContextType {
    user: User;
}

export const CurrentUserContext = createContext<CurrentUserContextType>({
    user: undefined,
} as unknown as CurrentUserContextType);
