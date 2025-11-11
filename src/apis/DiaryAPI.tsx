import type { Diary, DiaryKey } from '../types/journal';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface DiaryProps {
    text: string | null;
    date: string;
    tag_ids: string[];
}

interface UpdateDiaryProps {
    text: string | null;
    date: string;
    tag_ids: string[];
    update_keys: DiaryKey[];
}

export const DiaryAPI = {
    BASE_URL: '/api/diaries',

    create: async (props: DiaryProps): Promise<AxiosResponse<Diary>> => {
        return await client.post(DiaryAPI.BASE_URL, props);
    },
    update: async (id: string, props: UpdateDiaryProps): Promise<AxiosResponse<Diary>> => {
        return await client.put(`${DiaryAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${DiaryAPI.BASE_URL}/${id}`);
    },
};
