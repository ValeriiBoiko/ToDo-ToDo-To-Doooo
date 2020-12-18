import { ListItem } from "../types";

export interface AddItemAction {
  type: string,
  payload: ListItem,
};

export interface RemoveItemAction {
  type: string,
  payload: ListItem,
};

export interface UpdateItemAction {
  type: string,
  payload: ListItem
}

export type TodoAction = AddItemAction | RemoveItemAction | UpdateItemAction;
