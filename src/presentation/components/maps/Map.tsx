import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { Location } from '../../../infrastructure/interfaces/location';
import { FAB } from '../ui/FAB';
import { useEffect, useRef, useState } from 'react';
import { useLocationStore } from '../../store/location/useLocationStore';


interface Props {
    showsUserLocation?: boolean;
    initialLocation: Location;

}

export const Map = ( {showsUserLocation = true, initialLocation}: Props ) => {

    const { getLocation, lastknowLocation, watchLocation, clearwatchLocation, userLocationList } = useLocationStore();


    const mapRef = useRef<MapView>(null);

    const cameraLocation = useRef<Location>(initialLocation);

    const [isFollowingUser, setIsFollowingUser] = useState(true);

    const [isShowingPolyline, setIsShowingPolyline] = useState(true);


    
    const moveCameraToLocation = (location: Location) => {

        if(!mapRef.current) return; //primero preguntemonos si mapRef no tiene ningun valor entonces no podemos hacer nada. Type SafeTi

        //por lo contrario, hacemos la logica para animar el movimiento.
        mapRef.current?.animateCamera({
            center: location //la nueva posicion central va a ser la latitud y longitud que tenenmos
        })        
    }


    const moveToCurrentLocation = async() => {

        if(!lastknowLocation) {
            moveCameraToLocation(initialLocation);
        }

        const location = await getLocation(); //! Cada vez que mandamos a llamar la funcion getLocation estamos actualzando lo ultima ubicacion del usuario
        if( !location ) return;
        moveCameraToLocation(location);
    }


    useEffect(() => {
        watchLocation();
    
        return () => {
        clearwatchLocation();
        }
    }, []);

    
    useEffect(() => {
        if(lastknowLocation && isFollowingUser) {
            moveCameraToLocation( lastknowLocation )
        }
    }, [lastknowLocation, isFollowingUser]);
    
    


return (
    <>
        <MapView
            ref={ mapRef}

            showsUserLocation = {showsUserLocation}

            provider={PROVIDER_GOOGLE} // quitar si no estas usando Google Maps
            style={{flex:1}}
        
            //nuevo metodo
            onTouchStart={ () => setIsFollowingUser(false) }
            

            initialRegion={{
                latitude: cameraLocation.current.latitude,
                longitude: cameraLocation.current.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            }}
        >

            {
                isShowingPolyline && (
                    <Polyline 
                        coordinates={ userLocationList }
                        strokeColor='black' //tambien podemos poner una tranparencia de colores con rgba
                        strokeWidth={5}
                        //INCUSIVE TENEMOS EVENTOS
                    />
                )
            }

            {/* <Marker 
                coordinate={{
                    latitude: 37.78825,
                    longitude: -122.4324,
                }}
                title='Marcador'
                description='Lugar exacto en este momento'

                image={ require( '../../../assets/marker.png' ) } //para cambiar el "icono" del market establecido por defecto a uno que tu quieras
            /> */}


        </MapView>

        <FAB 
            iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline' }
            onPress={ () => setIsShowingPolyline(!isShowingPolyline) }
            style={{
                bottom: 140,
                right: 20,
            }}
        />

        <FAB 
            iconName= { isFollowingUser ? 'walk-outline' : 'accesibility-outline' }
            onPress={ () => setIsFollowingUser(!isFollowingUser) }
            style={{
                bottom: 80,
                right: 20,
            }}
        />

        <FAB 
            iconName='compass-outline'
            onPress={ moveToCurrentLocation }
            style={{
                bottom: 20,
                right: 20,
            }}
        />

    </>
)
}