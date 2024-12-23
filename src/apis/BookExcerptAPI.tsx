import type { BookExcerpt } from '../types/book_excerpt';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface BookExcerptProps {
    title: string;
    page_number: number;
    text: string;
    date: string;
    tag_ids: string[];
}

export const BookExcerptAPI = {
    BASE_URL: '/api/book_excerpts',

    list: async (): Promise<AxiosResponse<BookExcerpt[]>> => {
        return await client.get(BookExcerptAPI.BASE_URL);
    },
    create: async (props: BookExcerptProps): Promise<AxiosResponse<BookExcerpt>> => {
        return await client.post(BookExcerptAPI.BASE_URL, props);
    },
    update: async (id: string, props: BookExcerptProps): Promise<AxiosResponse<BookExcerpt>> => {
        return await client.put(`${BookExcerptAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${BookExcerptAPI.BASE_URL}/${id}`);
    },
};
