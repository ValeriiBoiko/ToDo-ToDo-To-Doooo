import { Action } from "./constants";
import { UpdateItemAction } from "./reducers/types";
import { ListItem } from "./types";

export function updateItemAction(item: ListItem): UpdateItemAction {
  return ({
    type: Action.UPDATE_ITEM,
    payload: item,
  })
}
