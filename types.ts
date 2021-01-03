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
}

export interface FontsCollection {
  LIHGT: string,
  REGULAR: string,
  MEDIUM: string,
  BOLD: string,
}

export interface TodoItemAction {
  type: string,
  payload: ListItem
}
