import type { Action, ActionTrackType, ActionWithGoal } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface ActionProps {
    name: string;
    discipline: string | null;
    memo: string | null;
    track_type: ActionTrackType;
}

interface UpdateActionProps {
    name: string;
    discipline: string | null;
    memo: string | null;
    color?: string;
}

interface ConvertActionTrackTypeProps {
    track_type: ActionTrackType;
}

export const ActionAPI = {
    BASE_URL: '/api/actions',

    list: async (showArchivedOnly = false): Promise<AxiosResponse<ActionWithGoal[]>> => {
        const url = `${ActionAPI.BASE_URL}${showArchivedOnly ? '?show_archived_only=true' : ''}`;
        return await client.get(url);
    },
    get: async (id: string): Promise<AxiosResponse<Action>> => {
        return await client.get(`${ActionAPI.BASE_URL}/${id}`);
    },
    create: async (props: ActionProps): Promise<AxiosResponse<Action>> => {
        return await client.post(ActionAPI.BASE_URL, props);
    },
    update: async (id: string, props: UpdateActionProps): Promise<AxiosResponse<Action>> => {
        return await client.put(`${ActionAPI.BASE_URL}/${id}`, props);
    },
    convert_track_type: async (id: string, props: ConvertActionTrackTypeProps): Promise<AxiosResponse<Action>> => {
        return await client.put(`${ActionAPI.BASE_URL}/${id}/track_type`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${ActionAPI.BASE_URL}/${id}`);
    },
    archive: async (id: string): Promise<AxiosResponse<Action>> => {
        return await client.put(`${ActionAPI.BASE_URL}/${id}/archive`);
    },
    unarchive: async (id: string): Promise<AxiosResponse<Action>> => {
        return await client.put(`${ActionAPI.BASE_URL}/${id}/unarchive`);
    },
    bulk_update_ordering: async (ordering: string[]): Promise<AxiosResponse> => {
        return await client.put(`${ActionAPI.BASE_URL}/bulk_update_ordering`, { ordering });
    },
};
