import { ListItem } from "../types";

export interface AddItemAction {
    type: string,
    payload: Omit<ListItem, 'id'>
};

export interface RemoveItemAction {
    type: string,
    payload: number,
};

export interface UpdateItemAction {
    type: string,
    payload: ListItem
}

export type TodoAction = AddItemAction | RemoveItemAction | UpdateItemAction;
