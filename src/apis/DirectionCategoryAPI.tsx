import type { DirectionCategory } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface DirectionCategoryProps {
    name: string;
}

export const DirectionCategoryAPI = {
    BASE_URL: '/api/direction_categories',

    list: async (showArchivedOnly = false): Promise<AxiosResponse<DirectionCategory[]>> => {
        const url = DirectionCategoryAPI.BASE_URL;
        return await client.get(url);
    },
    get: async (id: string): Promise<AxiosResponse<DirectionCategory>> => {
        return await client.get(`${DirectionCategoryAPI.BASE_URL}/${id}`);
    },
    create: async (props: DirectionCategoryProps): Promise<AxiosResponse<DirectionCategory>> => {
        return await client.post(DirectionCategoryAPI.BASE_URL, props);
    },
    update: async (id: string, props: DirectionCategoryProps): Promise<AxiosResponse<DirectionCategory>> => {
        return await client.put(`${DirectionCategoryAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${DirectionCategoryAPI.BASE_URL}/${id}`);
    },
    bulk_update_ordering: async (ordering: string[]): Promise<AxiosResponse> => {
        return await client.put(`${DirectionCategoryAPI.BASE_URL}/bulk_update_ordering`, { ordering });
    },
};
