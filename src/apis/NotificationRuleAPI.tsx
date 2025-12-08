import type { NotificationRule, NotificationRuleType } from '../types/notification';
import client from './axios';
import type { AxiosResponse } from 'axios';

export const NotificationRuleAPI = {
    BASE_URL: '/api/notification_rules',

    list: async (): Promise<AxiosResponse<NotificationRule[]>> => {
        return await client.get(NotificationRuleAPI.BASE_URL);
    },
    create: async (props: NotificationRule): Promise<AxiosResponse<NotificationRule>> => {
        return await client.post(NotificationRuleAPI.BASE_URL, props);
    },
    delete: async (type: NotificationRuleType): Promise<AxiosResponse> => {
        return await client.delete(`${NotificationRuleAPI.BASE_URL}?type=${type}`);
    },
};
