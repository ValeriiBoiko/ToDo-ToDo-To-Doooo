import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from "@react-native-async-storage/async-storage";
import todoReducer from './reducers';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const middleware = [thunk];
const persistedReducer = persistReducer(persistConfig, todoReducer);

export default () => {
  const store = createStore(persistedReducer, applyMiddleware(...middleware));
  const persistor = persistStore(store);

  return { store, persistor };
}
