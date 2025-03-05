import type { Tag } from './tag';

export interface Memo {
    id: string;
    title: string;
    text: string;
    date: string;
    favorite: boolean;
    created_at: string;
    updated_at: string;
    tags: Tag[];
}
