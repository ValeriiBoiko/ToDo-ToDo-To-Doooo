import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from './app.json';
import TodoList from './screens/TodoList';
import configureStore from './store';

const { store, persistor } = configureStore();

AppRegistry.registerComponent(appName, () => () => (
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <TodoList />
    </Provider>
  </PersistGate>
));
