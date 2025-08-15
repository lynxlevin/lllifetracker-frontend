import type { ThinkingNote } from '../types/journal';
import client from './axios';
import type { AxiosResponse } from 'axios';

export interface ThinkingNoteProps {
    question: string | null;
    thought: string | null;
    answer: string | null;
    tag_ids: string[];
}

export interface ThinkingNoteUpdateProps {
    question: string | null;
    thought: string | null;
    answer: string | null;
    resolved_at: string | null;
    archived_at: string | null;
    tag_ids: string[];
}

export const ThinkingNoteAPI = {
    BASE_URL: '/api/thinking_notes',

    list_active: async (): Promise<AxiosResponse<ThinkingNote[]>> => {
        return await client.get(ThinkingNoteAPI.BASE_URL);
    },
    list_resolved: async (): Promise<AxiosResponse<ThinkingNote[]>> => {
        return await client.get(`${ThinkingNoteAPI.BASE_URL}?resolved=true`);
    },
    list_archived: async (): Promise<AxiosResponse<ThinkingNote[]>> => {
        return await client.get(`${ThinkingNoteAPI.BASE_URL}?archived=true`);
    },
    create: async (props: ThinkingNoteProps): Promise<AxiosResponse<ThinkingNote>> => {
        return await client.post(ThinkingNoteAPI.BASE_URL, props);
    },
    update: async (id: string, props: ThinkingNoteUpdateProps): Promise<AxiosResponse<ThinkingNote>> => {
        return await client.put(`${ThinkingNoteAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${ThinkingNoteAPI.BASE_URL}/${id}`);
    },
};
