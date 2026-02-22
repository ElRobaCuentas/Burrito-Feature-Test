import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { BurritoLocation } from '../types';
import { COLORS } from '../../../shared/theme/colors';
import { 
  UNMSM_LOCATION, RUTA_OFICIAL, PARADEROS 
} from '../constants/map_route';
import { FAB } from './FAB';
import { StopCard } from './StopCard'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; 

Mapbox.setAccessToken('pk.eyJ1IjoiZWxyb2JhY3VlbnRhcyIsImEiOiJjbWx4MDc1Y2gwanpoM2txMzd1Mzl6YjN6In0.9c9y92FLxw_MeIZaX4EdPQ'); 

interface Props {
  burritoLocation: BurritoLocation | null;
  isDarkMode: boolean;
}

export const Map = ({ burritoLocation, isDarkMode }: Props) => {
  const cameraRef = useRef<Mapbox.Camera>(null);
  // 🛠️ NUEVO ESTADO: Guarda el ID del paradero seleccionado (o null si no hay ninguno)
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  // Función auxiliar para encontrar los datos del paradero seleccionado
  const selectedStopData = PARADEROS.find(p => p.id === selectedStopId);

  // 🧭 Sincronizar Cámara con el Burrito
  useEffect(() => {
    if (burritoLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: [burritoLocation.longitude, burritoLocation.latitude],
        zoomLevel: 16, 
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
        styleURL={isDarkMode ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Street}
        // 🛠️ IMPORTANTE: Si tocan cualquier parte del mapa que no sea un marcador, cerramos la tarjeta
        onPress={() => setSelectedStopId(null)}
      >
        <Mapbox.Camera
          ref={cameraRef}
          defaultSettings={{
            centerCoordinate: [UNMSM_LOCATION.longitude, UNMSM_LOCATION.latitude],
            zoomLevel: 16,
          }}
        />

        {/* 🛣️ RUTA OFICIAL */}
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

        {/* 📍 PARADEROS (Solo los iconos, SIN Callout dentro) */}
        {PARADEROS.map((p) => (
          <Mapbox.PointAnnotation
            key={p.id}
            id={p.id}
            coordinate={[p.longitude, p.latitude]}
            // 🛠️ Al tocar el icono, guardamos su ID en el estado
            onSelected={() => setSelectedStopId(p.id)}
          >
            <View style={styles.iconContainer}>
              <Icon name="map-marker-radius" size={35} color={COLORS.primary} style={styles.iconShadow} />
            </View>
            {/* ¡YA NO HAY CALLOUT AQUÍ! */}
          </Mapbox.PointAnnotation>
        ))}

        {/* 🚌 EL BURRITO */}
        {burritoLocation && (
          <Mapbox.MarkerView coordinate={[burritoLocation.longitude, burritoLocation.latitude]}>
            <View style={{ transform: [{ rotate: `${burritoLocation.heading || 0}deg` }] }}>
              <View style={styles.busGlow}>
                <Image 
                  source={require('../../../assets/bus.png')} 
                  style={styles.busImage} 
                />
              </View>
            </View>
          </Mapbox.MarkerView>
        )}
      </Mapbox.MapView>

      {/* 🛠️ LA TARJETA FLOTANTE: Se renderiza FUERA del mapa, por encima de todo */}
      {selectedStopData && (
        <View style={styles.floatingCardContainer}>
          <StopCard 
            title={selectedStopData.name} 
            onClose={() => setSelectedStopId(null)} // La X pone el estado en null
          />
        </View>
      )}

      <FAB 
        isFollowingBus={true}
        onFollowBus={() => {}}
        onCenterMap={() => {
            cameraRef.current?.setCamera({
                centerCoordinate: [UNMSM_LOCATION.longitude, UNMSM_LOCATION.latitude],
                zoomLevel: 16,
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
  iconContainer: { 
    width: 45, 
    height: 45, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  iconShadow: { 
    textShadowColor: 'rgba(255, 255, 255, 0.9)', 
    textShadowOffset: { width: 0, height: 0 }, 
    textShadowRadius: 8 
  },
  busGlow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 69, 58, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.5)',
  },
  busImage: { 
    width: 35, 
    height: 35, 
    resizeMode: 'contain' 
  },
  // 🛠️ Estilo para posicionar la tarjeta flotante
  floatingCardContainer: {
    position: 'absolute', // Flota sobre el mapa
    bottom: 100, // Por encima del FAB y la parte inferior
    left: 0,
    right: 0,
    zIndex: 999, // Asegura que esté arriba de todo
  }
});