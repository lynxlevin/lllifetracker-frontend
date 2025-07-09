export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
    first_track_at: string | null;
}
