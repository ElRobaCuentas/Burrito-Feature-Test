import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// 🔥 IMPORTAMOS EL TIPO USERSTATE
import { useUserStore, UserState } from '../../store/userStore';

import { LoginScreen } from '../../features/auth/screen/LoginScreen'; 
import { DrawerNavigator } from './DrawerNavigator';
import { LoadingScreen } from '../screen/LoadingScreen';

export type RootStackParams = {
  LoginScreen: undefined;
  MainApp: undefined;
  LoadingScreen: undefined;
};

const Stack = createStackNavigator<RootStackParams>();

export const StackNavigator = () => {
  // 🔥 ADIÓS AL 'ANY'. AHORA ESTÁ 100% TIPADO
  const isLoggedIn = useUserStore((state: UserState) => state.isLoggedIn);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        // --- GRUPO PROTEGIDO (Solo si tiene la llave) ---
        <Stack.Screen name="MainApp" component={DrawerNavigator} />
      ) : (
        // --- GRUPO PÚBLICO (La calle) ---
        <>
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen} 
            options={{
              // 🔥 PRO TWEAK: Animación de "Retroceso" al cerrar sesión
              animationTypeForReplace: !isLoggedIn ? 'pop' : 'push',
            }}
          />
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};