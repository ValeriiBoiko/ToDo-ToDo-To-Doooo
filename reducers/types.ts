import { ListItem } from "../types";

export interface TodoItemAction {
  type: string,
  payload: ListItem
}
