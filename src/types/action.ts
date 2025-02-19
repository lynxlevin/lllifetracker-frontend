import type { ObjectiveWithAmbitions } from './objective';

export interface Action {
    id: string;
    name: string;
    description: string | null;
    trackable?: boolean;
    created_at: string;
    updated_at: string;
}

export interface ActionWithLinks {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    objectives: ObjectiveWithAmbitions[];
}
