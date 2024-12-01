export type TagType = 'Ambition' | 'Objective' | 'Action';

export interface Tag {
    id: string;
    name: string;
    tag_type: TagType;
    created_at: string;
}