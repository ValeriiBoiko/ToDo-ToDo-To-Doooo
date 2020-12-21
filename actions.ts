import { Action } from "./constants";
import { ListItem, TodoItemAction } from "./types";


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
  return (dispatch: Function, getState: Function): void => {
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