import type { Tag } from './tag';

export interface Diary {
    id: string;
    text: string | null;
    date: string;
    score: number | null;
    tags: Tag[];
}

export type DiaryKey = 'Text' | 'Date' | 'Score' | 'TagIds';
