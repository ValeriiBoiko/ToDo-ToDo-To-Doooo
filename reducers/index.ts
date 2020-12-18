import { Action } from '../constants';
import { RootState } from '../types';
import { TodoAction } from './types';

const initialState = {
  list: [
    {
      id: 1,
      title: 'Item',
      isDone: false,
    }
  ],
};

function todoReducer(state: RootState = initialState, action: TodoAction): RootState {
  switch (action.type) {
    case Action.UPDATE_ITEM:
      return {
        ...state,
        list: state.list.map(item => (
          item.id === action.payload.id ? action.payload : item
        ))
      }
  }

  return state;
}

export default todoReducer;
