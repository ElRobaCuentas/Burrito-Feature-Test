import {AppRegistry} from 'react-native';
import { App } from './src/app/App'; 
import {name as appName} from './app.json';

// Ahora registramos MapsApp, que es lo que importamos arriba
AppRegistry.registerComponent(appName, () => App);