import { Action } from "./action";
import { Ambition } from "./ambition";

export interface Objective {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ObjectiveWithAmbitions {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    ambitions: Ambition[];
}

export interface ObjectiveWithActions {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    actions: Action[];
}

export interface ObjectiveWithLinks {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
    ambitions: Ambition[];
    actions: Action[];
}