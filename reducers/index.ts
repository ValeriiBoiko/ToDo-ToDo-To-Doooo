import { RootState } from '../types';
import { TodoAction } from './types';

const initialState = {
  list: [
    {
      id: 0,
      title: 'item 1',
      isDone: true,
    },
    {
      id: 1,
      title: 'item 1',
      isDone: false,
    }

  ],
};

function todoReducer(state: RootState = initialState, action: TodoAction) {
  return state;
}

export default todoReducer;
