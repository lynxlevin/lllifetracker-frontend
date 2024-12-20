import type { Tag } from './tag';

export interface MissionMemo {
    id: string;
    title: string;
    text: string;
    date: string;
    archived: boolean;
    accomplished_at: string | null;
    created_at: string;
    updated_at: string;
    tags: Tag[];
}
