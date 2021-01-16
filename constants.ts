import { ColorTheme, FontsCollection } from "./types";

export const Action = {
  UPDATE_ITEM: 'UPDATE_ITEM',
  ADD_ITEM: 'ADD_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  SET_COLOR_THEME: 'SET_COLOR_THEME',
} as const;

export const Font: FontsCollection = {
  LIHGT: 'Ubuntu-Light',
  REGULAR: 'Ubuntu-Regular',
  MEDIUM: 'Ubuntu-Medium',
  BOLD: 'Ubuntu-Bold',
};

export const LightTheme: ColorTheme = {
  primary: '#f4bc25',
  background: '#fafafa',
  border: '#ccc',
  text: '#444',
  invertedText: '#fafafa',
  card: '#e9e9e9',
  danger: '#ff5252'
};

export const DarkTheme: ColorTheme = {
  primary: '#f4bc25',
  background: '#222',
  border: '#888',
  text: '#fafafa',
  invertedText: '#444',
  card: '#353535',
  danger: '#ff5252'
};
