import type { Action } from './action';
import type { Ambition } from './ambition';

export interface Objective {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface ObjectiveWithAmbitions {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    ambitions: Ambition[];
}

export interface ObjectiveWithActions {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    actions: Action[];
}

export interface ObjectiveWithLinks {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    ambitions: Ambition[];
    actions: Action[];
}
