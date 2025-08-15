import type { Tag } from './tag';

export interface Diary {
    id: string;
    text: string | null;
    date: string;
    tags: Tag[];
}

export type DiaryKey = 'Text' | 'Date' | 'TagIds';


export interface ReadingNote {
    id: string;
    title: string;
    page_number: number;
    text: string;
    date: string;
    created_at: string;
    updated_at: string;
    tags: Tag[];
}
