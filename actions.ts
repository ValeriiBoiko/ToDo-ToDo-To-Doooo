import { DevSettings } from "react-native";
import { Middleware } from "redux";
import { Action } from "./constants";
import { TodoItemAction } from "./reducers/types";
import { ListItem, RootState } from "./types";


export function updateItemAction(item: ListItem): TodoItemAction {
  return {
    type: Action.UPDATE_ITEM,
    payload: item,
  }
}

export function addItemAction(item: ListItem): TodoItemAction {
  return {
    type: Action.ADD_ITEM,
    payload: item,
  }
}

export function addItem(title: string) {
  return (dispatch: Function, getState: Function) => {
    const list: ListItem[] = getState().list;

    dispatch(
      addItemAction({
        id: list[list.length - 1].id + 1,
        title: title,
        isDone: false,
      })
    )
  }
}