import type { Challenge } from '../types/challenge';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface ChallengeProps {
    title: string;
    text: string;
    date: string;
    tag_ids: string[];
}

export const ChallengeAPI = {
    BASE_URL: '/api/challenges',

    list: async (): Promise<AxiosResponse<Challenge[]>> => {
        return await client.get(ChallengeAPI.BASE_URL);
    },
    create: async (props: ChallengeProps): Promise<AxiosResponse<Challenge>> => {
        return await client.post(ChallengeAPI.BASE_URL, props);
    },
    update: async (id: string, props: ChallengeProps): Promise<AxiosResponse<Challenge>> => {
        return await client.put(`${ChallengeAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${ChallengeAPI.BASE_URL}/${id}`);
    },
    archive: async (id: string): Promise<AxiosResponse<Challenge>> => {
        return await client.put(`${ChallengeAPI.BASE_URL}/${id}/archive`);
    },
    markAccomplished: async (id: string): Promise<AxiosResponse<Challenge>> => {
        return await client.put(`${ChallengeAPI.BASE_URL}/${id}/accomplish`);
    },
};
