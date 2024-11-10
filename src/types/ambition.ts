import { ObjectiveWithActions } from "./objective";

export interface Ambition {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface AmbitionWithLinks {
    id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    objectives: ObjectiveWithActions[];
}