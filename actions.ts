import { Action } from "./constants";
import { ColorTheme, ListItem, TodoItemAction } from "./types";

export function deleteItemAction(item: ListItem): TodoItemAction {
  return {
    type: Action.DELETE_ITEM,
    payload: item,
  }
}

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

export function setColorThemeAction(theme: ColorTheme) {
  return {
    type: Action.SET_COLOR_THEME,
    payload: theme,
  }
}

export function addItem(item: Omit<ListItem, 'id'>) {
  return (dispatch: Function, getState: Function): void => {
    const list: ListItem[] = getState().list;

    dispatch(
      addItemAction({
        ...item,
        id: list.length ? list[list.length - 1].id + 1 : 0,
      })
    )
  }
}

export function removeItem(itemId: number) {
  return (dispatch: Function, getState: Function): void => {
    const list: ListItem[] = getState().list;

    dispatch(
      addItemAction({
        ...item,
        id: list[list.length - 1].id + 1,
      })
    )
  }
}