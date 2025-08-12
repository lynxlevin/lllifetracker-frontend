import type { ActionGoal } from '../types/my_way';
import client from './axios';
import type { AxiosResponse } from 'axios';

export interface ActionGoalCreateProps {
    action_id: string;
    duration_seconds: number | null;
    count: number | null;
}

export const ActionGoalAPI = {
    BASE_URL: '/api/action_goals',

    create: async (props: ActionGoalCreateProps): Promise<AxiosResponse<ActionGoal>> => {
        return await client.post(ActionGoalAPI.BASE_URL, props);
    },
    delete: async (actionId: string): Promise<AxiosResponse> => {
        return await client.delete(`${ActionGoalAPI.BASE_URL}?action_id=${actionId}`);
    },
};
