import { Action, DarkTheme } from '../constants';
import { ColorThemeAction, DeleteTodoItemAction, RootState, TodoItemAction } from '../types';

const initialState = {
  theme: DarkTheme,
  list: [],
};

type Actiontype = TodoItemAction | DeleteTodoItemAction | ColorThemeAction

function todoReducer(state: RootState = initialState, action: Actiontype): RootState {
  switch (action.type) {
    case Action.UPDATE_ITEM:
      return {
        ...state,
        list: state.list.map(item => (
          item.id === action.payload.id ? action.payload : item
        ))
      }

    case Action.ADD_ITEM:
      return {
        ...state,
        list: state.list.concat(action.payload),
      }

    case Action.DELETE_ITEM:
      return {
        ...state,
        list: state.list.filter(item => item.id !== action.payload)
      }

    case Action.SET_COLOR_THEME:
      return {
        ...state,
        theme: action.payload
      }

    default:
      return state;
  }
}

export default todoReducer;
