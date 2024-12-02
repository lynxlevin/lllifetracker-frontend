import type { Tag } from './tag';

export interface Memo {
    id: string;
    title: string;
    text: string | null;
    date: string;
    created_at: string;
    updated_at: string;
    tags: Tag[];
}
