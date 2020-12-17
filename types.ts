export interface ListItem {
  id: number,
  title: string,
  isDone: boolean,
};

export interface RootState {
  list: ListItem[],
}
