export type TagType = 'Ambition' | 'DesiredState' | 'Mindset' | 'Action' | 'Plain';

export interface Tag {
    id: string;
    name: string;
    tag_type: TagType;
    created_at: string;
}
