export interface ActionTrack {
    id: string;
    action_id: string;
    started_at: string;
    ended_at: string | null;
    duration: number | null;
}

export interface ActionTrackDailyList {
    [yearMonth: string]: {date: number, actionTracks: ActionTrack[]}[];
}

export interface ActionTrackAggregation {
    durations_by_action: DurationsByAction[];
}

export interface ActionTrackDailyAggregation {
    [yearMonth: string]: { date: number; aggregation: DurationsByAction[] }[];
}

export interface DurationsByAction {
    action_id: string;
    duration: number;
    count: number;
}
