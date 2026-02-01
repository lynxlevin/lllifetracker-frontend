export interface WebPushSubscriptionFromServer {
    device_name: string;
    expiration_epoch_time: number | null;
}

export type NotificationRuleType = "AmbitionOrDirection" | "Ambition" | "Direction";
export type RecurrenceType = "Everyday" | "Weekday" | "Weekend";
export interface NotificationRule {
    type: NotificationRuleType;
    recurrence_type: RecurrenceType;
    time: string;
}