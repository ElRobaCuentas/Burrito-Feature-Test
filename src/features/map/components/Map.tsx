import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { BurritoLocation } from '../types';
import { COLORS } from '../../../shared/theme/colors';
import { 
  UNMSM_LOCATION, RUTA_OFICIAL, PARADEROS 
} from '../constants/map_route';
import { FAB } from './FAB';

// Configuración inicial de la llave
Mapbox.setAccessToken('pk.eyJ1IjoiZWxyb2JhY3VlbnRhcyIsImEiOiJjbWx4MDc1Y2gwanpoM2txMzd1Mzl6YjN6In0.9c9y92FLxw_MeIZaX4EdPQ'); 

interface Props {
  burritoLocation: BurritoLocation | null;
  isDarkMode: boolean;
}

export const Map = ({ burritoLocation, isDarkMode }: Props) => {
  const cameraRef = useRef<Mapbox.Camera>(null);

  // 🧭 Sincronizar Cámara con el Burrito
  useEffect(() => {
    if (burritoLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: [burritoLocation.longitude, burritoLocation.latitude],
        animationDuration: 2000,
      });
    }
  }, [burritoLocation]);

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        logoEnabled={false}
        attributionEnabled={false}
        // 🌓 LA MAGIA: El mapa cambia de color suavemente sin recargar
        styleURL={isDarkMode ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Street}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={15.5}
          centerCoordinate={[UNMSM_LOCATION.longitude, UNMSM_LOCATION.latitude]}
        />

        {/* 🛣️ RUTA OFICIAL (Carga vectorial ultra fluida) */}
        <Mapbox.ShapeSource id="routeSource" shape={{
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: RUTA_OFICIAL.map(c => [c.longitude, c.latitude])
          },
          properties: {}
        }}>
          <Mapbox.LineLayer
            id="routeLayer"
            style={{
              lineColor: COLORS.primary,
              lineWidth: 5,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </Mapbox.ShapeSource>

        {/* 📍 PARADEROS */}
        {PARADEROS.map((p) => (
          <Mapbox.PointAnnotation
            key={p.id}
            id={p.id}
            coordinate={[p.longitude, p.latitude]}
          >
            <View style={styles.markerContainer}>
               <View style={styles.markerDot} />
            </View>
          </Mapbox.PointAnnotation>
        ))}

        {/* 🚌 EL BURRITO (Animación a 60 FPS) */}
        {burritoLocation && (
          <Mapbox.MarkerView coordinate={[burritoLocation.longitude, burritoLocation.latitude]}>
            <View style={{ transform: [{ rotate: `${burritoLocation.heading || 0}deg` }] }}>
              <Image 
                source={require('../../../assets/bus.png')} 
                style={styles.busImage} 
              />
            </View>
          </Mapbox.MarkerView>
        )}
      </Mapbox.MapView>

      <FAB 
        isFollowingBus={true}
        onFollowBus={() => {}}
        onCenterMap={() => {
            cameraRef.current?.setCamera({
                centerCoordinate: [UNMSM_LOCATION.longitude, UNMSM_LOCATION.latitude],
                zoomLevel: 15.5,
                animationDuration: 1000
            });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  markerContainer: {
    height: 20,
    width: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary
  },
  markerDot: {
    height: 8,
    width: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 4
  },
  busImage: { width: 40, height: 40, resizeMode: 'contain' }
});