import client from './axios';
import { AxiosResponse } from 'axios';

interface LoginProps {
    email: string;
    password: string;
}

interface MeResponse {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
}

export const UserAPI = {
    BASE_URL: '/users',

    login: async (data: LoginProps) => {
        const url = `${UserAPI.BASE_URL}/login`;
        return await client.post(url, data, { headers: { 'content-type': 'application/json' } });
    },
    me: async (): Promise<AxiosResponse<MeResponse | string>> => {
        const url = `${UserAPI.BASE_URL}/me`;
        return await client.get(url);
    },
    logout: async () => {
        const url = `${UserAPI.BASE_URL}/logout`;
        return await client.post(url, {}, { headers: { 'content-type': 'application/json' } });
    },
};
