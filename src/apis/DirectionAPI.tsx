import type { Direction } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface DirectionProps {
    name: string;
    description: string | null;
    category_id: string | null;
}

export const DirectionAPI = {
    BASE_URL: '/api/directions',

    list: async (showArchivedOnly = false): Promise<AxiosResponse<Direction[]>> => {
        const url = `${DirectionAPI.BASE_URL}${showArchivedOnly ? '?show_archived_only=true' : ''}`;
        return await client.get(url);
    },
    get: async (id: string): Promise<AxiosResponse<Direction>> => {
        return await client.get(`${DirectionAPI.BASE_URL}/${id}`);
    },
    create: async (props: DirectionProps): Promise<AxiosResponse<Direction>> => {
        return await client.post(DirectionAPI.BASE_URL, props);
    },
    update: async (id: string, props: DirectionProps): Promise<AxiosResponse<Direction>> => {
        return await client.put(`${DirectionAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${DirectionAPI.BASE_URL}/${id}`);
    },
    archive: async (id: string): Promise<AxiosResponse<Direction>> => {
        return await client.put(`${DirectionAPI.BASE_URL}/${id}/archive`);
    },
    unarchive: async (id: string): Promise<AxiosResponse<Direction>> => {
        return await client.put(`${DirectionAPI.BASE_URL}/${id}/unarchive`);
    },
    bulk_update_ordering: async (ordering: string[]): Promise<AxiosResponse> => {
        return await client.put(`${DirectionAPI.BASE_URL}/bulk_update_ordering`, { ordering });
    },
};
