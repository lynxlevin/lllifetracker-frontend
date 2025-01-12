export interface ActionTrack {
    id: string;
    action_id: string | null;
    action_name: string | null;
    started_at: string;
    ended_at: string | null;
    duration: number | null;
}
