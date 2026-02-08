import {AppRegistry} from 'react-native';
import { MapsApp } from './src/MapsApp'; 
import {name as appName} from './app.json';

// Ahora registramos MapsApp, que es lo que importamos arriba
AppRegistry.registerComponent(appName, () => MapsApp);