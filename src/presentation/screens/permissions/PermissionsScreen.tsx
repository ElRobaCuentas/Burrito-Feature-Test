//aqui vamos a consumir nuestro store


import { AppState, Linking, Pressable, Text, View } from 'react-native'
import { globalStyles } from '../../../config/theme/styles'
import { usePermissionStore } from '../../store/permissions/usePermissionStore'
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../navigations/StackNavigator';
import { useEffect } from 'react';

export const PermissionsScreen = () => {

  const { locationStatus, requestLocationPermission, checkLocationPermission } = usePermissionStore();

  const navigation = useNavigation<NavigationProp<RootStackParams>>();



  useEffect(() => {
    if( locationStatus === 'granted' ) {
      navigation.reset({
        routes:[{name: 'MapScreen'}]
      })
    }
  }, [locationStatus])

    useEffect(() => {
    checkLocationPermission();
  }, []);


useEffect(() => {

    const subscription = AppState.addEventListener('change', (nextAppState) => {
        console.log( 'AppState', nextAppState)

        if (nextAppState === 'active') {
            checkLocationPermission();
        }

        });

    return () => {
      subscription.remove(); //es importante limpiarla despues de usarla
    }
  }, [])
  


  return (
    <View  style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

      <Text> Habilitar ubicación </Text>

      <Pressable
        style={ globalStyles.btnPrimary }
        onPress={() => {
          if (locationStatus === 'blocked') {
            Linking.openSettings();
          } else {
            requestLocationPermission();
          }
        }}
      >
        <Text style={{ color: 'white' }}>
            { locationStatus === 'blocked' ? 'Abrir Ajustes' : 'Habilitar Localización' }
        </Text>
      </Pressable>

      <Text> Estado actual: {locationStatus} </Text>
    
    </View>
  )
}

