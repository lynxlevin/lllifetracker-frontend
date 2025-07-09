import type { DateObject } from 'react-multi-date-picker';
import type { ActionTrack, ActionTrackAggregation, ActionTrackDailyAggregation } from '../types/action_track';
import client from './axios';
import type { AxiosResponse } from 'axios';

interface CreateActionTrackProps {
    started_at: string;
    action_id: string | null;
}

interface UpdateActionTrackProps extends CreateActionTrackProps {
    ended_at: string | null;
}

interface AggregateActionTrackProps {
    range?: { from: Date; to: Date };
    multiple?: DateObject[];
}

interface DailyAggregationProps {
    year_month: number;
}

export const ActionTrackAPI = {
    BASE_URL: '/api/action_tracks',

    list: async (activeOnly = false, startedAtGte?: Date): Promise<AxiosResponse<ActionTrack[]>> => {
        let url = ActionTrackAPI.BASE_URL;
        if (activeOnly) url += '?active_only=true';
        if (startedAtGte) {
            url += `${activeOnly ? '&' : '?'}started_at_gte=${startedAtGte.toISOString()}`;
        }
        return await client.get(url);
    },
    listByDate: async (): Promise<AxiosResponse<ActionTrack[][]>> => {
        return await client.get(`${ActionTrackAPI.BASE_URL}/by_date`);
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
    aggregation: async (props: AggregateActionTrackProps): Promise<AxiosResponse<ActionTrackAggregation>> => {
        if (props.range) {
            return await client.get(
                `${ActionTrackAPI.BASE_URL}/aggregation?started_at_gte=${props.range.from.toISOString()}&started_at_lte=${props.range.to.toISOString()}`,
            );
        }
        const dates = props.multiple?.map(date => date.format('YYYYMMDD'));
        return await client.get(`${ActionTrackAPI.BASE_URL}/aggregation?dates=${dates}`);
    },
    dailyAggregation: async (props: DailyAggregationProps): Promise<AxiosResponse<ActionTrackDailyAggregation>> => {
        return await client.get(`${ActionTrackAPI.BASE_URL}/aggregation/daily?year_month=${props.year_month}`);
    },
};
