import type { Tag } from './tag';

export interface Diary {
    id: string;
    text: string | null;
    date: string;
    tags: Tag[];
}

export type DiaryKey = 'Text' | 'Date' | 'TagIds';
