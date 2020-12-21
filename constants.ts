import { ColorTheme, FontsCollection } from "./types";

export const Action = {
  UPDATE_ITEM: 'UPDATE_ITEM',
  ADD_ITEM: 'ADD_ITEM',
};

export const Font: FontsCollection = {
  LIHGT: 'Ubuntu-Light',
  REGULAR: 'Ubuntu-Regular',
  MEDIUM: 'Ubuntu-Medium',
  BOLD: 'Ubuntu-Bold',
};

export const LightTheme: ColorTheme = {
  primary: '#f4bc25',
  background: '#f5f5f5',
  border: '#ccc',
  text: '#444',
  card: '#e9e9e9',
};

export const DarkTheme: ColorTheme = {
  primary: '#f4bc25',
  background: '#222',
  border: '#ccc',
  text: '#f5f5f5',
  card: '#353535',
};
