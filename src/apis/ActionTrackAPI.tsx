import type { AxiosResponse } from "axios";
import type { ActionTrack, ActionTrackAggregation, ActionTrackDailyAggregation } from "../types/action_track";
import client from "./axios";

interface ListActionTracksProps {
    activeOnly?: boolean;
    startedAtGte?: Date;
    startedAtLte?: Date;
}

interface CreateActionTrackProps {
    started_at: string;
    action_id: string | null;
}

interface UpdateActionTrackProps extends CreateActionTrackProps {
    ended_at: string | null;
}

interface AggregateActionTrackProps {
    from: Date;
    to: Date;
}

interface DailyAggregationProps {
    year_month: number;
}

export const ActionTrackAPI = {
    BASE_URL: "/api/action_tracks",

    list: async ({ activeOnly = false, startedAtGte, startedAtLte }: ListActionTracksProps): Promise<AxiosResponse<ActionTrack[]>> => {
        let url = ActionTrackAPI.BASE_URL;
        const queries = [];
        if (activeOnly) queries.push("active_only=true");
        if (startedAtGte) {
            queries.push(`started_at_gte=${startedAtGte.toISOString()}`);
        }
        if (startedAtLte) {
            queries.push(`started_at_lte=${startedAtLte.toISOString()}`);
        }
        if (queries.length > 0) {
            url += `?${queries.join("&")}`;
        }
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
    // MEMO: not used since deleting /aggregations page, but will be used in action aggregation tab.
    aggregation: async (props: AggregateActionTrackProps): Promise<AxiosResponse<ActionTrackAggregation>> => {
        return await client.get(`${ActionTrackAPI.BASE_URL}/aggregation?started_at_gte=${props.from.toISOString()}&started_at_lte=${props.to.toISOString()}`);
    },
    dailyAggregation: async (props: DailyAggregationProps): Promise<AxiosResponse<ActionTrackDailyAggregation>> => {
        return await client.get(`${ActionTrackAPI.BASE_URL}/aggregation/daily?year_month=${props.year_month}`);
    },
};
