import type { Mindset } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface MindsetProps {
    name: string;
    description: string | null;
}

export const MindsetAPI = {
    BASE_URL: '/api/mindsets',

    list: async (showArchivedOnly = false): Promise<AxiosResponse<Mindset[]>> => {
        const url = `${MindsetAPI.BASE_URL}${showArchivedOnly ? '?show_archived_only=true' : ''}`;
        return await client.get(url);
    },
    get: async (id: string): Promise<AxiosResponse<Mindset>> => {
        return await client.get(`${MindsetAPI.BASE_URL}/${id}`);
    },
    create: async (props: MindsetProps): Promise<AxiosResponse<Mindset>> => {
        return await client.post(MindsetAPI.BASE_URL, props);
    },
    update: async (id: string, props: MindsetProps): Promise<AxiosResponse<Mindset>> => {
        return await client.put(`${MindsetAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${MindsetAPI.BASE_URL}/${id}`);
    },
    archive: async (id: string): Promise<AxiosResponse<Mindset>> => {
        return await client.put(`${MindsetAPI.BASE_URL}/${id}/archive`);
    },
    unarchive: async (id: string): Promise<AxiosResponse<Mindset>> => {
        return await client.put(`${MindsetAPI.BASE_URL}/${id}/unarchive`);
    },
    bulk_update_ordering: async (ordering: string[]): Promise<AxiosResponse> => {
        return await client.put(`${MindsetAPI.BASE_URL}/bulk_update_ordering`, { ordering });
    },
};
