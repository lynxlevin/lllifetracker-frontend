import type { ReadingNote } from '../types/journal';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface ReadingNoteProps {
    title: string;
    page_number: number;
    text: string;
    date: string;
    tag_ids: string[];
}

export const ReadingNoteAPI = {
    BASE_URL: '/api/reading_notes',

    create: async (props: ReadingNoteProps): Promise<AxiosResponse<ReadingNote>> => {
        return await client.post(ReadingNoteAPI.BASE_URL, props);
    },
    update: async (id: string, props: ReadingNoteProps): Promise<AxiosResponse<ReadingNote>> => {
        return await client.put(`${ReadingNoteAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${ReadingNoteAPI.BASE_URL}/${id}`);
    },
};
