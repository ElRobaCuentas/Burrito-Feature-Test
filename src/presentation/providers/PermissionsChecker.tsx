import { PropsWithChildren, useEffect } from "react"
import { AppState } from "react-native"
import { usePermissionStore } from "../store/permissions/usePermissionStore"
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../navigations/StackNavigator";
// import { checkLocationPermission } from "../../actions/permissions/location";

export const PermissionsChecker = ({children}: PropsWithChildren) => {

    
  const { locationStatus, checkLocationPermission  } = usePermissionStore();

  const navigation = useNavigation<NavigationProp<RootStackParams>>()



  /*  
    Orden de los useEffect: Al final siempre es el mismo resultado.

    ? Ya que checkLocationPermission es una función asíncrona. 
    ? Independientemente de cuál pongas primero, la respuesta de Android siempre tardará más que la ejecución de los useEffect. 
     El flujo final siempre será:
     - Ver undetermined -> Ir a Loading.
     - Recibir respuesta de Android -> Actualizar estado.
     - Reaccionar al cambio -> Ir a Map o Permissions.

    ? Lo que realmente pasa: El Store nace con undetermined. El useEffect de navegación dice: "Ok, prepárate para ir a LoadingScreen".

    Acción inmediata: El useEffect de checkLocationPermission() se dispara al mismo tiempo. 
    Como Android responde casi instantáneamente (porque ya tiene el permiso en su "Memoria a Largo Plazo"), 
    el Store se actualiza a granted ( va a la pantalla de MapScreen) antes de que la pantalla de carga ( LoadingScreen) logre dibujarse físicamente en el monitor.

  */

  //!el problema con la navegación es que puedo "retrocecer" a por ejemplo a mi pantalla de Loading (cosa que no debería pasar)
  //!para solucionar eso se podría usar un replace(), pero YA NO "EXISTE"

  useEffect(() => {
    if( locationStatus === 'granted' ) {

      // navigation.navigate('MapScreen') //con esto puedo retroceder a mi pantalla de Loading... (Y ESO EN LA REALIDAD NO SE PUEDE HACER)

      navigation.reset( {
        routes: [{ name: 'MapScreen' }]
      } ) 
      
      //TODO: Metodo que recibe un objeto como argumento ynos a a pedir como queremos establecer nuestro set de rutas. Es como el replace, solo que con la diferencia es que acá defino A QUE RUTA QUIERO IR
      //TODO: Puedo crear tambien un stack de tarjetas (varias rutas, en las cuales puedo ir y volver, pero esa no es la idea)


    } else if ( locationStatus !== 'undetermined' ) {
      
      // navigation.navigate('LoadingScreen') //si recien abre la app presentamos una screen de carga (loading screeb)
    
      navigation.reset( {
        routes: [{ name: 'LoadingScreen' }]
      } )

    }
  }, [locationStatus]);



  useEffect(() => {
    checkLocationPermission();
  }, []);


  //para verificar el estado de la aplicación
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
    <> { children } </>
  )
}