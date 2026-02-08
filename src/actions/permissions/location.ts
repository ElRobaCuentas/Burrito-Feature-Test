//quiero manejar solo los permisos relacionados a esa localizacion

import { PermissionStatus as RNPermissionStatus, request, PERMISSIONS, openSettings, check } from 'react-native-permissions'
import type { PermissionStatus } from "../../infrastructure/interfaces/permissions"
import { Platform } from 'react-native';


/*
    ? sobre el request() y check() IDEALMENTE ESTOS DOS PROCIDIMIENTOS DEBEN ESTAR SEPARADOS.

    ¿Por qué?  CUANDO INMEDIATAMENTE LA APP SE LANZA E INMEDIATAMENTE NOS PIDA LA UBICACIÓN SIN DARLE CHANCE
    DE VER COMO ES LA APP. LO MAS PROBABLE ES QUE LOS USUARIOS LO DENIEGUEN.

    ES IDEAL QUE EL USUARIO SEPA CUANDO Y EN QUE MOMENTO LE VAMOS A PEDIR LOS PERMISOS DE UBICACIÓN
*/



//1. solicitud de un permiso

//! request() va a abrirnos un popup que nos va a decir "Esta aplicación requiere acceso a tu ubicacion, etc."
export const requestLocationPermission = async(): Promise<PermissionStatus> => {

    //esto lo importamos de react native != que es diferente a importarlo de las interfaces. 
    //Para no confundirme. Arriba, en el import le voy a cambiar de nombre
    let status: RNPermissionStatus = 'unavailable';


    //vamos a preguntar dependiendo si estamos el android o ios

    if (Platform.OS === 'ios') {
      status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE); //tambien hay otra que se llama LOCATION_ALWAYS (claro, es depende si lo vamos a utilizar o no)
    } else if (Platform.OS === 'android') {
      status = await request( PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION) //tambien hay otros (puedes investigar más adelante)
    } else {
        throw new Error( 'PLATAFORMA NO SOPORTADA' )
        // return 'unavailable' NO DISPONIBLE. Puede ser, pero si alguien lanza esto en la web tiene más sentido, simplemente la plaltaforma no concuerda
    }

    // if( status === 'blocked' ) {
    //     await openSettings();  //va a abrir las settings del dispositivo para que el usuario manualmente abra la app y habilite el location

    //     //cuando la persona regresa (ya otorgó el permiso manualmente desde las settings del telefono) podemos hacer un return de...
    //     //esto lo hace con el check...
    //     return await checkLocationPermission();
    // }


    //Supongamos que la persona le de el acceso.
    //el record es para ahorrarme un switch
    const permissionMapper: Record<RNPermissionStatus, PermissionStatus> = {
        granted: 'granted',
        denied: 'denied',
        blocked: 'blocked',
        unavailable: 'unavailable',
        limited: 'limited',
    }

    return permissionMapper[status] ?? 'unavailable'; 
    //tambien puede ser undetermined
 
}


//una funcion asincrona, que regresa una promesa que resuelve un PermissionStatus (de nuestra interface)
//! check() esto verifica si ya se ha otorgado o no Y NO PREGUNTA. Nos va a servir para verificarlo, sin lanza el popup. 
//!Entonces el ckeck nos sirve para esto: 
//? sobre el request() y check() IDEALMENTE ESTOS DOS PROCIDIMIENTOS DEBEN ESTAR SEPARADOS.

//!Si ya me dio acceso o no. Si es asi le mando a otra pantalla. 
//*Y SI NO ME LO HA DADO, VOY A LLEVARLO A OTRA PANTALLA PARA QUE INTENCIONALMENTE AHI SE MANDE A LLAMAR A LA PRIMERA FUNCIÓN
//requestLocationPermission

export const checkLocationPermission = async(): Promise<PermissionStatus> => {

    let status: RNPermissionStatus = 'unavailable';

    if (Platform.OS === 'ios') {
      status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      status = await check( PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION); 
    } else {
        throw new Error( 'PLATAFORMA NO SOPORTADA' )
    }

    const permissionMapper: Record<RNPermissionStatus, PermissionStatus> = {
        granted: 'granted',
        denied: 'denied',
        blocked: 'blocked',
        unavailable: 'unavailable',
        limited: 'limited',
    }

    return permissionMapper[status] ?? 'unavailable'; 

}