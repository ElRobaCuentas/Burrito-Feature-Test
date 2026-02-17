import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../../features/home/screen/HomeScreen';
import { LoadingScreen } from '../screen/LoadingScreen';
import { MapScreen } from '../../features/map/screen/MapScreen';
export type RootStackParams = {
    LoadingScreen: undefined;
    MapScreen: undefined;
    HomeScreen: undefined;
}


const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () =>  {
  return (
    <Stack.Navigator
        initialRouteName='HomeScreen'
        screenOptions={{
            headerShown: false,
            cardStyle: {
                backgroundColor: 'white'
            }
        }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      <Stack.Screen name="MapScreen" component={MapScreen} />
    </Stack.Navigator>
  );
}