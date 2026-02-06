//cuanto mas precisa sea la geolocalizacion, hay mas consuma de bateria. Por eso ser considerados de las peticiones
//que hacemos con la petición del usuario.  


import Geolocation from '@react-native-community/geolocation';
import { Location } from '../../infrastructure/interfaces/location';


export const getCurrentLocation = async(): Promise<Location> => {

    return new Promise( (resolve, reject) => {
        Geolocation.getCurrentPosition( info => {
            resolve({
                latitude: info.coords.latitude,
                longitude: info.coords.longitude
            })   
        },(error) => {
            console.log(`Can't get location`)
            reject(error)
        }, {
            enableHighAccuracy: true //? PONER SI O SI SI ESTAMOS EN ANDROID
        })
    })
}






{/*
    ... No regresa tampoco una promesa. El problema es que funciona en base a callbacks y no en promesas, ni strings
    ni funciones generadoras que seria lo ideal.

    Lo que haremos es regresar (return) el watchPosition() y esta funcion retorna un number. Ese numero es el que
    vamos a ocupar para limpiar el watch (clear watch), para despues cancelarlo.

    En la funcion watchPosition vamos a recibir el locationCallback (la funcion que queremos mandar a llamar
    cuando tenemos una nueva ubicación), pero el argumento que vamos a tener dentro de locationCallback es una
    location:Location 

    Esa funcion locationCallback es la funcion que vamos a mandar a llamar dentro de watchPosition. 
    Con la informacion de la latitude y longitude


    */}


export const watchCurrentLocation = 
    (locationCallback: (location:Location) => void 
):number => {

    return Geolocation.watchPosition( info => (
        locationCallback({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
        })
    ), (error) => {
        throw new Error(`Can't get watchPosition`);
    } , { 
        enableHighAccuracy: true,
    });
}

 
//cuando llamemos a la funcion watchCurrentLocation nos regresa el number, y ese number es el que tenemos que
//usar despues para tener la limpieza y que deje de seguir el dispositivo


export const clearWatchLocation = ( watchId: number ) => {

    Geolocation.clearWatch(watchId)

}

