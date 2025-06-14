export interface Ambition {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface DesiredState {
    id: string;
    name: string;
    description: string | null;
    category_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface Mindset {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export type ActionTrackType = 'TimeSpan' | 'Count';

export interface Action {
    id: string;
    name: string;
    description: string | null;
    trackable?: boolean;
    color?: string;
    track_type: ActionTrackType;
    created_at: string;
    updated_at: string;
}

export interface DesiredStateCategory {
    id: string;
    name: string;
}
