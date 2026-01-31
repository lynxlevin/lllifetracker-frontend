import type { DesiredState } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface DesiredStateProps {
    name: string;
    description: string | null;
    category_id: string | null;
}

export const DesiredStateAPI = {
    BASE_URL: '/api/desired_states',

    list: async (showArchivedOnly = false): Promise<AxiosResponse<DesiredState[]>> => {
        const url = `${DesiredStateAPI.BASE_URL}${showArchivedOnly ? '?show_archived_only=true' : ''}`;
        return await client.get(url);
    },
    get: async (id: string): Promise<AxiosResponse<DesiredState>> => {
        return await client.get(`${DesiredStateAPI.BASE_URL}/${id}`);
    },
    create: async (props: DesiredStateProps): Promise<AxiosResponse<DesiredState>> => {
        return await client.post(DesiredStateAPI.BASE_URL, props);
    },
    update: async (id: string, props: DesiredStateProps): Promise<AxiosResponse<DesiredState>> => {
        return await client.put(`${DesiredStateAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${DesiredStateAPI.BASE_URL}/${id}`);
    },
    archive: async (id: string): Promise<AxiosResponse<DesiredState>> => {
        return await client.put(`${DesiredStateAPI.BASE_URL}/${id}/archive`);
    },
    unarchive: async (id: string): Promise<AxiosResponse<DesiredState>> => {
        return await client.put(`${DesiredStateAPI.BASE_URL}/${id}/unarchive`);
    },
    bulk_update_ordering: async (ordering: string[]): Promise<AxiosResponse> => {
        return await client.put(`${DesiredStateAPI.BASE_URL}/bulk_update_ordering`, { ordering });
    },
};
