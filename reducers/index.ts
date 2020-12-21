import { Action, DarkTheme, LightTheme } from '../constants';
import { RootState, TodoItemAction } from '../types';

const initialState = {
  theme: LightTheme,
  list: [
    {
      id: 1,
      title: 'Item',
      isDone: false,
    }
  ],
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
  }

  return state;
}

export default todoReducer;
