import type { Ambition } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface AmbitionProps {
    name: string;
    description: string | null;
}

export const AmbitionAPI = {
    BASE_URL: '/api/ambitions',

    list: async (showArchivedOnly = false): Promise<AxiosResponse<Ambition[]>> => {
        const url = `${AmbitionAPI.BASE_URL}${showArchivedOnly ? '?show_archived_only=true' : ''}`;
        return await client.get(url);
    },
    get: async (id: string): Promise<AxiosResponse<Ambition>> => {
        return await client.get(`${AmbitionAPI.BASE_URL}/${id}`);
    },
    create: async (props: AmbitionProps): Promise<AxiosResponse<Ambition>> => {
        return await client.post(AmbitionAPI.BASE_URL, props);
    },
    update: async (id: string, props: AmbitionProps): Promise<AxiosResponse<Ambition>> => {
        return await client.put(`${AmbitionAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${AmbitionAPI.BASE_URL}/${id}`);
    },
    archive: async (id: string): Promise<AxiosResponse<Ambition>> => {
        return await client.put(`${AmbitionAPI.BASE_URL}/${id}/archive`);
    },
    unarchive: async (id: string): Promise<AxiosResponse<Ambition>> => {
        return await client.put(`${AmbitionAPI.BASE_URL}/${id}/unarchive`);
    },
    bulk_update_ordering: async (ordering: string[]): Promise<AxiosResponse> => {
        return await client.put(`${AmbitionAPI.BASE_URL}/bulk_update_ordering`, { ordering });
    },
};
