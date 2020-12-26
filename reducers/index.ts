import { Action, DarkTheme, LightTheme } from '../constants';
import { RootState, TodoItemAction } from '../types';

const initialState = {
  theme: LightTheme,
  list: [],
};

function todoReducer(state: RootState = initialState, action: TodoItemAction): RootState {
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
        list: state.list.filter(item => item.id !== action.payload.id)
      }
  }

  return state;
}

export default todoReducer;
