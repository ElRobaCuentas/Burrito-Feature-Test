import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../../features/home/screen/HomeScreen'; // Revisa que tu ruta sea correcta
import { LoadingScreen } from '../screen/LoadingScreen'; // Revisa que tu ruta sea correcta
import { MapScreen } from '../../features/map/screen/MapScreen'; // 👈 Apunta a MapScreen

export type RootStackParams = {
    LoadingScreen: undefined;
    HomeScreen: undefined;
    MainApp: undefined;
}

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () =>  {
  return (
    <Stack.Navigator
        // 🚀 Volvemos al inicio real: HomeScreen
        initialRouteName='HomeScreen' 
        screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="MainApp" component={MapScreen} /> 
    </Stack.Navigator>
  );
}