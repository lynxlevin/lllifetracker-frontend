import type { Journal } from '../types/journal';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface JournalListQuery {
    tag_id_or?: string[];
}

export const JournalAPI = {
    BASE_URL: '/api/journals',

    list: async (query: JournalListQuery): Promise<AxiosResponse<Journal[]>> => {
        let url = JournalAPI.BASE_URL;
        const queries = [];
        if (query.tag_id_or) queries.push(`tag_id_or=${query.tag_id_or.join(',')}`);
        if (queries.length > 0) url += `?${queries.join('&')}`;
        return await client.get(url);
    },
};
