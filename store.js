import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from "@react-native-async-storage/async-storage";
import todoReducer from './reducers';
import { createStore } from 'redux';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, todoReducer);

export default () => {
    const store = createStore(persistedReducer);
    const persistor = persistStore(store);
}
