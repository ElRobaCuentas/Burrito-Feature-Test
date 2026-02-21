import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../../features/home/screen/HomeScreen';
import { LoadingScreen } from '../screen/LoadingScreen';
import { DrawerNavigator } from './DrawerNavigator'; 

export type RootStackParams = {
    LoadingScreen: undefined;
    HomeScreen: undefined;
    MainApp: undefined;
}

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () =>  {
  return (
    <Stack.Navigator
        initialRouteName='HomeScreen'
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'white' }
        }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      
      {/* 🚀 EL CORTE SECO: animationEnabled: false evita que el mapa y la animación compitan */}
      <Stack.Screen 
        name="MainApp" 
        component={DrawerNavigator} 
        options={{ animation: 'none' }} 
      /> 
    </Stack.Navigator>
  );
}