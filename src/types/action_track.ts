export interface ActionTrack {
    id: string;
    action_id: string;
    started_at: string;
    ended_at: string | null;
    duration: number | null;
}

export interface ActionTrackAggregation {
    durations_by_action: { action_id: string; duration: number; count: number }[];
}
