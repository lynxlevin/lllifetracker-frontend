export type TagType = 'Ambition' | 'DesiredState' | 'Action';
export type TagColor = 'ambitions.100' | 'desiredStates.100' | 'actions.100';

export interface Tag {
    id: string;
    name: string;
    tag_type: TagType;
    created_at: string;
}
