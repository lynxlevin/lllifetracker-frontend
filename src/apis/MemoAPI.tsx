import type { Memo } from '../types/memo';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface MemoProps {
    title: string;
    text: string;
    date: string;
    tag_ids: string[];
}

export const MemoAPI = {
    BASE_URL: '/api/memos',

    list: async (): Promise<AxiosResponse<Memo[]>> => {
        return await client.get(MemoAPI.BASE_URL);
    },
    // create: async (props: MemoProps): Promise<AxiosResponse<Memo>> => {
    //     return await client.post(MemoAPI.BASE_URL, props);
    // },
    update: async (id: string, props: MemoProps): Promise<AxiosResponse<Memo>> => {
        return await client.put(`${MemoAPI.BASE_URL}/${id}`, props);
    },
    // delete: async (id: string): Promise<AxiosResponse> => {
    //     return await client.delete(`${MemoAPI.BASE_URL}/${id}`);
    // },
};
