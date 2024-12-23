import type { Tag } from './tag';

export interface BookExcerpt {
    id: string;
    title: string;
    page_number: number;
    text: string;
    date: string;
    created_at: string;
    updated_at: string;
    tags: Tag[];
}
