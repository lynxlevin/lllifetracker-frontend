import { Ambition, AmbitionWithLinks } from '../types/ambition';
import client from './axios';
import { AxiosResponse } from 'axios';

interface AmbitionProps {
    name: string;
    description: string | null;
}

export const AmbitionAPI = {
    BASE_URL: '/ambitions',

    list: async (): Promise<AxiosResponse<Ambition[]>> => {
        return await client.get(AmbitionAPI.BASE_URL);
    },
    listWithLinks: async (): Promise<AxiosResponse<AmbitionWithLinks[]>> => {
        return await client.get(`${AmbitionAPI.BASE_URL}?links=true`);
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
    connectObjective: async (ambitionId: string, objectiveId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await client.post(`${AmbitionAPI.BASE_URL}/${ambitionId}/objectives/${objectiveId}`, {});
    },
    disconnectObjective: async (ambitionId: string, objectiveId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await client.delete(`${AmbitionAPI.BASE_URL}/${ambitionId}/objectives/${objectiveId}`);
    },
};
