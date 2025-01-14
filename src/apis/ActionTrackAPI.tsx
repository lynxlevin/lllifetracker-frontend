import type { ActionTrack } from '../types/action_track';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface CreateActionTrackProps {
    started_at: string;
    action_id: string | null;
}

interface UpdateActionTrackProps extends CreateActionTrackProps {
    ended_at: string | null;
}

export const ActionTrackAPI = {
    BASE_URL: '/api/action_tracks',

    list: async (activeOnly = false): Promise<AxiosResponse<ActionTrack[]>> => {
        let url = ActionTrackAPI.BASE_URL;
        if (activeOnly) url += '?active_only=true';
        return await client.get(url);
    },
    create: async (props: CreateActionTrackProps): Promise<AxiosResponse<ActionTrack>> => {
        return await client.post(ActionTrackAPI.BASE_URL, props);
    },
    update: async (id: string, props: UpdateActionTrackProps): Promise<AxiosResponse<ActionTrack>> => {
        return await client.put(`${ActionTrackAPI.BASE_URL}/${id}`, props);
    },
    delete: async (id: string): Promise<AxiosResponse> => {
        return await client.delete(`${ActionTrackAPI.BASE_URL}/${id}`);
    },
};
