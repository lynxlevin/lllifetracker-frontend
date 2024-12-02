import type { Action, ActionWithLinks } from '../types/action';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface ActionProps {
    name: string;
    description: string | null;
}

export const ActionAPI = {
    BASE_URL: '/api/actions',

    list: async (): Promise<AxiosResponse<Action[]>> => {
        return await client.get(ActionAPI.BASE_URL);
    },
    listWithLinks: async (): Promise<AxiosResponse<ActionWithLinks[]>> => {
        return await client.get(`${ActionAPI.BASE_URL}?links=true`);
    },
    get: async (id: string): Promise<AxiosResponse<Action>> => {
        return await client.get(`${ActionAPI.BASE_URL}/${id}`);
    },
    create: async (props: ActionProps): Promise<AxiosResponse<Action>> => {
        return await client.post(ActionAPI.BASE_URL, props);
    },
    update: async (id: string, props: ActionProps): Promise<AxiosResponse<Action>> => {
        return await client.put(`${ActionAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${ActionAPI.BASE_URL}/${id}`);
    },
};
