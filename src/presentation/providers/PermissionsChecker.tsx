import { useEffect } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { usePermissionStore } from '../store/permissions/usePermissionStore';
import { RootStackParams } from '../navigations/StackNavigator';

export const PermissionsChecker = () => {

  const { locationStatus, checkLocationPermission } = usePermissionStore();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    if( locationStatus === 'granted' ) {
      navigation.reset( {
        routes: [{ name: 'MapScreen' }]
      })       
    } else if ( locationStatus === 'denied' || locationStatus === 'blocked' ) {      
      navigation.reset( {
        routes: [{ name: 'PermissionsScreen' }]
      })
    }
  }, [locationStatus]);

  return null; 
}


/*
  Convertimos a PermissionsChecker en un componente que solo piense y que no pinte nada. 
  
  ! return null: 
  React dice: "Ah, ok. Este componente existe, ejecuta su lógica (useEffects, hooks, estados), 
  pero no pinta nada. 
*/












































// import { PropsWithChildren, useEffect } from "react"
// import { AppState } from "react-native"
// import { usePermissionStore } from "../store/permissions/usePermissionStore"
// import { NavigationProp, useNavigation } from "@react-navigation/native";
// import { RootStackParams } from "../navigations/StackNavigator";


// export const PermissionsChecker = ({children}: PropsWithChildren) => {

    
//   const { locationStatus, checkLocationPermission  } = usePermissionStore();

//   const navigation = useNavigation<NavigationProp<RootStackParams>>()


//   useEffect(() => {
//     if( locationStatus === 'granted' ) {
//       // navigation.navigate('MapScreen') //con esto puedo retroceder a mi pantalla de Loading... (Y ESO EN LA REALIDAD NO SE PUEDE HACER)
//       navigation.reset( {
//         routes: [{ name: 'MapScreen' }]
//       } ) 
      
//       //TODO: Metodo que recibe un objeto como argumento ynos a a pedir como queremos establecer nuestro set de rutas. Es como el replace, solo que con la diferencia es que acá defino A QUE RUTA QUIERO IR
//       //TODO: Puedo crear tambien un stack de tarjetas (varias rutas, en las cuales puedo ir y volver, pero esa no es la idea)


//     } else if ( locationStatus === 'denied' || locationStatus === 'blocked' ) {
      
//       // navigation.navigate('LoadingScreen') //si recien abre la app presentamos una screen de carga (loading screeb)
    
//       navigation.reset( {
//         routes: [{ name: 'PermissionsScreen' }]
//       } )

//     }
//   }, [locationStatus]);



//   useEffect(() => {
//     checkLocationPermission();
//   }, []);


//   //para verificar el estado de la aplicación
//   useEffect(() => {

//     const subscription = AppState.addEventListener('change', (nextAppState) => {
//         console.log( 'AppState', nextAppState)

//         if (nextAppState === 'active') {
//             checkLocationPermission();
//         }

//         });

//     return () => {
//       subscription.remove(); //es importante limpiarla despues de usarla
//     }
//   }, [])

  
//     return (
//     <> { children } </>
//   )
// }