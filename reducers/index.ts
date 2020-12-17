import { RootState } from '../types';
import { TodoAction } from './types';

const initialState = {
    list: [],
};

function todoReducer(state: RootState = initialState, action: TodoAction) {
    return state;
}

export default todoReducer;
