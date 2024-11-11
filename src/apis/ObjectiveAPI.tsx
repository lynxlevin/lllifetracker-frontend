import type { Objective, ObjectiveWithLinks } from '../types/objective';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface ObjectiveProps {
    name: string;
}

export const ObjectiveAPI = {
    BASE_URL: '/objectives',

    list: async (): Promise<AxiosResponse<Objective[]>> => {
        return await client.get(ObjectiveAPI.BASE_URL);
    },
    listWithLinks: async (): Promise<AxiosResponse<ObjectiveWithLinks[]>> => {
        return await client.get(`${ObjectiveAPI.BASE_URL}?links=true`);
    },
    get: async (id: string): Promise<AxiosResponse<Objective>> => {
        return await client.get(`${ObjectiveAPI.BASE_URL}/${id}`);
    },
    create: async (props: ObjectiveProps): Promise<AxiosResponse<Objective>> => {
        return await client.post(ObjectiveAPI.BASE_URL, props);
    },
    update: async (id: string, props: ObjectiveProps): Promise<AxiosResponse<Objective>> => {
        return await client.put(`${ObjectiveAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${ObjectiveAPI.BASE_URL}/${id}`);
    },
    connectAction: async (objectiveId: string, actionId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await client.post(`${ObjectiveAPI.BASE_URL}/${objectiveId}/actions/${actionId}/connection`, {});
    },
    disconnectAction: async (objectiveId: string, actionId: string): Promise<AxiosResponse<{ message: string }>> => {
        return await client.delete(`${ObjectiveAPI.BASE_URL}/${objectiveId}/actions/${actionId}/connection`);
    },
};
