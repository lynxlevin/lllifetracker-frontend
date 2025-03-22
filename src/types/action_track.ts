export interface ActionTrack {
    id: string;
    action_id: string | null;
    action_name: string | null;
    action_color: string | null;
    started_at: string;
    ended_at: string | null;
    duration: number | null;
    startedAt?: Date;
    endedAt?: Date;
    date?: string;
}

export interface ActionTrackAggregation {
    durations_by_action: { action_id: string; duration: number }[];
}
