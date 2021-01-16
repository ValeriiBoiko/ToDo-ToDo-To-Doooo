import { Action } from "./constants";

export interface ListItem {
  id: number,
  title: string,
  note?: string,
  isDaily: boolean,
  isDone: boolean,
  updated?: Date | null
};

export interface RootState {
  theme: ColorTheme,
  list: ListItem[],
}

export interface ColorTheme {
  primary: string,
  background: string,
  border: string,
  text: string,
  invertedText: string,
  card: string,
  danger: string
}

export interface FontsCollection {
  LIHGT: string,
  REGULAR: string,
  MEDIUM: string,
  BOLD: string,
}

export interface TodoItemAction {
  type: typeof Action.ADD_ITEM | typeof Action.UPDATE_ITEM,
  payload: ListItem
}

export interface DeleteTodoItemAction {
  type: typeof Action.DELETE_ITEM,
  payload: number
}

export interface ColorThemeAction {
  type: typeof Action.SET_COLOR_THEME,
  payload: ColorTheme
}
