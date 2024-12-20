import type { MissionMemo } from '../types/mission_memo';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface MissionMemoProps {
    title: string;
    text: string;
    date: string;
    tag_ids: string[];
}

export const MissionMemoAPI = {
    BASE_URL: '/api/mission_memos',

    list: async (): Promise<AxiosResponse<MissionMemo[]>> => {
        return await client.get(MissionMemoAPI.BASE_URL);
    },
    create: async (props: MissionMemoProps): Promise<AxiosResponse<MissionMemo>> => {
        return await client.post(MissionMemoAPI.BASE_URL, props);
    },
    update: async (id: string, props: MissionMemoProps): Promise<AxiosResponse<MissionMemo>> => {
        return await client.put(`${MissionMemoAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${MissionMemoAPI.BASE_URL}/${id}`);
    },
    archive: async (id: string): Promise<AxiosResponse<MissionMemo>> => {
        return await client.put(`${MissionMemoAPI.BASE_URL}/${id}/archive`);
    },
    markAccomplished: async (id: string): Promise<AxiosResponse<MissionMemo>> => {
        return await client.put(`${MissionMemoAPI.BASE_URL}/${id}/accomplish`);
    },
};
