import { ListViewBase } from 'react-native';
import { Action } from '../constants';
import { RootState } from '../types';
import { TodoItemAction } from './types';

const initialState = {
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
