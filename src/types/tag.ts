export type TagType = 'Ambition' | 'Direction' | 'Action' | 'Plain';

export interface Tag {
    id: string;
    name: string;
    type: TagType;
    created_at: string;
}
