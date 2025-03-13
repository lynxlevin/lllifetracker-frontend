import type { DesiredState, DesiredStateWithLinks } from '../types/desired_state';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface DesiredStateProps {
    name: string;
    description: string | null;
}

export const DesiredStateAPI = {
    BASE_URL: '/api/desired_states',

    list: async (): Promise<AxiosResponse<DesiredState[]>> => {
        return await client.get(DesiredStateAPI.BASE_URL);
    },
    listWithLinks: async (): Promise<AxiosResponse<DesiredStateWithLinks[]>> => {
        return await client.get(`${DesiredStateAPI.BASE_URL}?links=true`);
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
    linkAction: async (desiredStateId: string, actionId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await client.post(`${DesiredStateAPI.BASE_URL}/${desiredStateId}/actions/${actionId}/connection`, {});
    },
    unlinkAction: async (desiredStateId: string, actionId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await client.delete(`${DesiredStateAPI.BASE_URL}/${desiredStateId}/actions/${actionId}/connection`);
    },
};
