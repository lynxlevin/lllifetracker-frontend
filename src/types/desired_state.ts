import type { Action } from './action';
import type { Ambition } from './ambition';

export interface DesiredState {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface DesiredStateWithAmbitions {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    ambitions: Ambition[];
}

export interface DesiredStateWithActions {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    actions: Action[];
}

export interface DesiredStateWithLinks {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    ambitions: Ambition[];
    actions: Action[];
}
