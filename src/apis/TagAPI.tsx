import type { Tag } from '../types/tag';
import client from './axios';
import type { AxiosResponse } from 'axios';

export const TagAPI = {
    BASE_URL: '/api/tags',

    list: async (): Promise<AxiosResponse<Tag[]>> => {
        return await client.get(TagAPI.BASE_URL);
    },
    create: async (name: string): Promise<AxiosResponse<Tag>> => {
        return await client.post(TagAPI.BASE_URL, { name });
    },
};
