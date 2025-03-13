import type { DesiredStateWithAmbitions } from './desired_state';

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
    desired_states: DesiredStateWithAmbitions[];
}
