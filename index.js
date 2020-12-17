import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import TodoList from './screens/TodoList';

AppRegistry.registerComponent(appName, () => TodoList);
