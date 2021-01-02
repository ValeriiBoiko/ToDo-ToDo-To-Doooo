import React from 'react';
import { AppRegistry, StatusBar } from 'react-native';
import CodePush from 'react-native-code-push';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { name as appName } from './app.json';
import TodoList from './screens/TodoList';
import configureStore from './store';

const { store, persistor } = configureStore();

const App = () => (
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <SafeAreaProvider>
        <TodoList />
      </SafeAreaProvider>
    </Provider>
  </PersistGate>
);

AppRegistry.registerComponent(appName, () => CodePush(App));
