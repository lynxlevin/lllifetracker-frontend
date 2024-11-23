import type { User } from '../types/user';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface LoginProps {
    email: string;
    password: string;
}

export const UserAPI = {
    BASE_URL: '/api/users',

    login: async (data: LoginProps): Promise<AxiosResponse<User>> => {
        const url = `${UserAPI.BASE_URL}/login`;
        return await client.post(url, data);
    },
    me: async (): Promise<AxiosResponse<User>> => {
        const url = `${UserAPI.BASE_URL}/me`;
        return await client.get(url);
    },
    logout: async () => {
        const url = `${UserAPI.BASE_URL}/logout`;
        return await client.post(url, {});
    },
};
