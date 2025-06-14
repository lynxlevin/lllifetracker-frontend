import type { DesiredStateCategory } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface DesiredStateCategoryProps {
    name: string;
}

export const DesiredStateCategoryAPI = {
    BASE_URL: '/api/desired_state_categories',

    list: async (showArchivedOnly = false): Promise<AxiosResponse<DesiredStateCategory[]>> => {
        const url = DesiredStateCategoryAPI.BASE_URL;
        return await client.get(url);
    },
    get: async (id: string): Promise<AxiosResponse<DesiredStateCategory>> => {
        return await client.get(`${DesiredStateCategoryAPI.BASE_URL}/${id}`);
    },
    create: async (props: DesiredStateCategoryProps): Promise<AxiosResponse<DesiredStateCategory>> => {
        return await client.post(DesiredStateCategoryAPI.BASE_URL, props);
    },
    update: async (id: string, props: DesiredStateCategoryProps): Promise<AxiosResponse<DesiredStateCategory>> => {
        return await client.put(`${DesiredStateCategoryAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${DesiredStateCategoryAPI.BASE_URL}/${id}`);
    },
    bulk_update_ordering: async (ordering: string[]): Promise<AxiosResponse> => {
        return await client.put(`${DesiredStateCategoryAPI.BASE_URL}/bulk_update_ordering`, { ordering });
    },
};
