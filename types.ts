export interface ListItem {
  id: number,
  title: string,
  isDone: boolean,
};

export interface RootState {
  list: ListItem[],
}

export interface ColorTheme {
  primary: string,
  background: string,
  border: string,
  text: string,
}

export interface FontsCollection {
  LIHGT: string,
  REGULAR: string,
  MEDIUM: string,
  BOLD: string,
};
