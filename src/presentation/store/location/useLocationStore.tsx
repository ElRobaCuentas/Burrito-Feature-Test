//vamos a crear nuestro gestor de zustand

import { create } from "zustand";
import { Location } from "../../../infrastructure/interfaces/location";
import { clearWatchLocation, getCurrentLocation, watchCurrentLocation } from "../../../actions/location/location";

//Comenzamos con una interface porque es bueno saber que es lo que nosotros vamos a tener
interface LocationState {

    lastknowLocation: Location | null; //ultima ubicación conocida del usuario. Por eejemplo si tocamos un boton nos redirije a la ubicacion del usuario (nos va a dar la toma)
    
    
    watchID: number | null;
    userLocationList: Location[];


    //lo que estariamos esperando
    getLocation: () => Promise<Location | null> //tambien puede lanzar null, pq la location puede fallar y entonces lanzamos una excepcion

    watchLocation: () => void;
    clearwatchLocation: () => void;



}


export const useLocationStore = create<LocationState>()( (set, get) => ({

    lastknowLocation: null, //en este momento es null porque no lo conozco

    userLocationList: [], //*estado inicial
    watchID: null,  //*esto inicial


    getLocation: async() => { //

        const location = await getCurrentLocation(); //por acá obtenemos la información y con la información
        //? vamos a establecer la nueva ubicación conocida que acabamos de obtener.
        //? con la ubicación que nosotros acabamos de obtener (location) vamos a establecer la nueva ubicación (con el set hacemos eso y lo guardamos dentro de lastKnowLocation)
        set({lastknowLocation: location});

        //y para que esta info nos sirva en otros logares podemos hacer un return de la location
        return location;
    },




    
        
    watchLocation: () => {
        const watchId = get().watchID;
        if( watchId !== null ) {
            get().clearwatchLocation();
        }


        const id = watchCurrentLocation( (location) => {

            console.log("NUEVA UBICACIÓN:", location);
            set({
                lastknowLocation: location,
                userLocationList: [...get().userLocationList, location]
            })
        });

        set({watchID:id})


    },

    clearwatchLocation: () => {
        const watchId = get().watchID;
        if( watchId !== null ) {
            clearWatchLocation(watchId);
        }
    }


}))




/*
    Para esta parte lo que quiero hacer es mostrar la ruta por donde el usuario se ha movido. 
    Teniamos nuestro userLocation : Location[], eso lo cambiamos a userLocationList: Location[]; PARA 
    DARLE UN NOMBRE ,AS SIGNIFICATIVO. Dar a entender que es una lista de "locations".


    Vamos a tomar ese userLocationlist y lo tomamos de nuestro stote en Map.tsx
    const { getLocation, lastknowLocation, watchLocation, clearwatchLocation, userLocationList } = useLocationStore();

    Ahora, para mostrar las polylines. Es un componente que lo tomamos del mismo paquete de MapView
    que se llama literalmente <Polyline />

    Este Polyline esta esperando las coordenadas. 
        cordinates={ userLocationList }

    * HASTA AHORA ES FACIL.

    !SE PUEDE IVESTIGAR MAS. POR EJEMPLO SI EL UUSARIO VA MAS RAPIDO SE PUEDE CAMBIAR DE COLOR. ETC...
    AHORA DIME EL LINK DE LA DOCUMENTACION PARA INVESTIGAR MAS ESO


    Lo ultimo que quiero hacer es que el usuario pueda mostrar y ocultar las polylines. 

    Nos creamos otro estado

    const [isShowingPolyline, setIsShowingPolyline] = useState(true) 

    ...

    <Polyline 
        coordinates={ userLocationList }
        strokeColor='black' //tambien podemos poner una tranparencia de colores con rgba
        strokeWidth={5}
        //INCUSIVE TENEMOS EVENTOS
    
    />

    Vamos a hacer que el usuario pueda mostrar y ocultar los polylines. Que es exavtamente a lo que hemos 
    hecho arriba con el movimeinto del mapa y con el botón.


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

    tambien tenemos un boton que me permita mostrarlo y ocultarlo.
    ... EXPLICA LA LOGICA DEL BOTON EN MAP.TSX
    





*/