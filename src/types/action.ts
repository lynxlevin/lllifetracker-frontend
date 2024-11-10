import { ObjectiveWithAmbitions } from "./objective";

export interface Action {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ActionWithLinks {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    objectives: ObjectiveWithAmbitions[];
}