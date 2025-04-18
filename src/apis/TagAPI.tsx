import type { Tag } from '../types/tag';
import client from './axios';
import type { AxiosResponse } from 'axios';

export const TagAPI = {
    BASE_URL: '/api/tags',

    list: async (): Promise<AxiosResponse<Tag[]>> => {
        return await client.get(TagAPI.BASE_URL);
    },
    create: async (name: string): Promise<AxiosResponse<Tag>> => {
        return await client.post(`${TagAPI.BASE_URL}/plain`, { name });
    },
    update: async (tag_id: string, name: string): Promise<AxiosResponse<Tag>> => {
        return await client.put(`${TagAPI.BASE_URL}/plain/${tag_id}`, { name });
    },
    delete: async (tag_id: string): Promise<AxiosResponse> => {
        return await client.delete(`${TagAPI.BASE_URL}/plain/${tag_id}`);
    },
};
