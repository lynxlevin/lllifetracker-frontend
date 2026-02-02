export interface Ambition {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface Direction {
    id: string;
    name: string;
    description: string | null;
    category_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface DirectionCategory {
    id: string;
    name: string;
}

export type ActionTrackType = 'TimeSpan' | 'Count';

export interface Action {
    id: string;
    name: string;
    discipline: string | null;
    memo: string | null;
    color?: string;
    track_type: ActionTrackType;
    created_at: string;
    updated_at: string;
}

export interface ActionGoal {
    id: string;
    from_date: string;
    to_date: string;
    duration_seconds: number;
    count: number;
}

export interface ActionWithGoal extends Action {
    goal: ActionGoal | null;
}

export interface ActionFull extends ActionWithGoal {
    aggregation: {
        durationForTheDay: number;
        countForTheDay: number;
    };
    remainingMiles: number | null;
}
