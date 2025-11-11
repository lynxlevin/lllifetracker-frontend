import type { Tag } from './tag';

export type JournalKind = 'Diary' | 'ReadingNote' | 'ThinkingNote';
export interface Journal {
    diary: Diary | null;
    reading_note: ReadingNote | null;
    thinking_note: ThinkingNote | null;
    kind: JournalKind;
}

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


export interface ThinkingNote {
    id: string;
    question: string | null;
    thought: string | null;
    answer: string | null;
    resolved_at: string | null;
    created_at: string;
    updated_at: string;
    tags: Tag[];
}
