import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { useLocationStore } from '../../store/location/useLocationStore';
import { LoadingScreen } from '../loading/LoadingScreen';
import { Map } from '../../components/maps/Map';
import { useEffect } from 'react';

export const MapScreen = () => {

  {/*
      //!NO HACER ESTO YA QUE EL COMPONENTE SE PUEDE RENDERIAR VARIAS VECES
      // getCurrentLocation().then( (location) => {
      //   console.log(location);
      // })
  */}


  const { lastknowLocation, getLocation } = useLocationStore();


  {/* Usamos el useEffect para que este código se ejecute solo una vez (cuando el componente nace). 
      Si pusiéramos getLocation() suelto, pasaría lo siguiente:
        - El componente se dibuja (Render).
        - Se ejecuta getLocation().
        - Esta función actualiza el estado (setLastKnownLocation).
        - En React, cuando un estado cambia, el componente se vuelve a dibujar por completo.
        - Al redibujarse, volvería a leer la línea de getLocation(), ejecutándola otra vez.
        - Esto crea un bucle infinito que congelaría la aplicación.

    // ! Decidir si ACTUAMOS.

    Oye, acabo de nacer. ¿Tengo coordenadas? No. Ah, entonces dispara la función para buscarlas.

    // ? este if es una buena práctica por si en el futuro la dependencia cambia. Asegura que no busquemos el GPS si ya lo tenemos.

  */}

  useEffect(() => {
    if(lastknowLocation === null) {
      getLocation()
    }
  }, [])
  

  {/* 
    
    //! Decidir qué DIBUJAMOS

    Oye, React quiere pintar el mapa AHORA MISMO. ¿Tengo coordenadas? No, todavía son null. ¡Espera! 
    No pintes el mapa porque explotará (necesita latitud y longitud). Mejor pinta una pantalla de carga mientras esperamos.
    
    */}

  if(lastknowLocation === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    )
  }


  console.log(" UBICACIÓN RECIBIDA:", JSON.stringify(lastknowLocation, null, 2));

  return (
    <View style={styles.container} >

      <Map 
        initialLocation= {lastknowLocation} //esto como puede ser null me va a marcar un error, porque para mostrar el mapa siempre necesito un lastKnowLocation. Entonces, podemos hacer una condición.
      />

    </View>
  )
}


const styles = StyleSheet.create({
 container: {
   ...StyleSheet.absoluteFillObject,
 },

});


