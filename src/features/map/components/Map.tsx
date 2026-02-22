import React, { useEffect, useRef, useState, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BurritoLocation } from '../types';
import { COLORS } from '../../../shared/theme/colors';
import { RUTA_GEOJSON, PARADEROS } from '../constants/map_route';
import { useMapStore } from '../../../store/mapStore'; 
import { StopCard } from './StopCard'; 

Mapbox.setAccessToken('pk.eyJ1IjoiZWxyb2JhY3VlbnRhcyIsImEiOiJjbWx4MDc1Y2gwanpoM2txMzd1Mzl6YjN6In0.9c9y92FLxw_MeIZaX4EdPQ'); 

interface Props {
  burritoLocation: BurritoLocation | null;
  isDarkMode: boolean;
}

export const Map = ({ burritoLocation, isDarkMode }: Props) => {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const followTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 🛠️ Conexión con los botones (MapScreen -> Store -> Mapa)
  const { command, setCommand, isFollowing, setIsFollowing } = useMapStore();
  
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const selectedStopData = PARADEROS.find(p => p.id === selectedStopId);

  // 🛠️ Estado para el vuelo suave al abrir la app
  const [isTransitioning, setIsTransitioning] = useState(true);

  // 🎬 1. INTRO CINEMATOGRÁFICO (Suave de 2.5 segundos)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (burritoLocation && isTransitioning) {
      cameraRef.current?.setCamera({
        centerCoordinate: [burritoLocation.longitude, burritoLocation.latitude],
        zoomLevel: 17,
        animationDuration: 2500,
      });
      timer = setTimeout(() => setIsTransitioning(false), 2500);
    }
    return () => { if (timer) clearTimeout(timer); };
  }, [burritoLocation == null]);

  // 🎯 2. ESCUCHAR LOS BOTONES (Centrar o Seguir)
  useEffect(() => {
    if (!command) return;

    // 🚨 EL TRUCO: Si presionas un botón, "matamos" cualquier temporizador que haya quedado vivo del botón anterior.
    if (followTimeoutRef.current) {
      clearTimeout(followTimeoutRef.current);
      followTimeoutRef.current = null;
    }

    if (command === 'center') {
      setIsFollowing(false); // Apagamos el seguimiento
      cameraRef.current?.setCamera({
        centerCoordinate: [-77.0825, -12.0575],
        zoomLevel: 15.1,
        animationDuration: 1500,
        animationMode: 'flyTo', 
      });
    } else if (command === 'follow' && burritoLocation) {
      cameraRef.current?.setCamera({
        centerCoordinate: [burritoLocation.longitude, burritoLocation.latitude],
        zoomLevel: 17, // 👈 FIX: Lo bajamos a 17 para que sea IGUAL al seguimiento automático y no rebote
        animationDuration: 1500,
        animationMode: 'flyTo', 
      });
      
      // Guardamos el temporizador en la referencia
      followTimeoutRef.current = setTimeout(() => {
        setIsFollowing(true);
      }, 1500);
    }
    setCommand(null); 
  }, [command]);

  // 🔄 3. SEGUIMIENTO AUTOMÁTICO DEL BUS (Cada 450ms)
  useEffect(() => {
    if (burritoLocation && isFollowing && !isTransitioning) {
      cameraRef.current?.setCamera({
        centerCoordinate: [burritoLocation.longitude, burritoLocation.latitude],
        zoomLevel: 17, // 👈 Tiene que ser IGUAL al del botón para evitar el salto
        animationDuration: 450,
        animationMode: 'easeTo', // 👈 'easeTo' es mejor para actualizaciones continuas cortas
      });
    }
  }, [burritoLocation?.latitude, burritoLocation?.longitude, isFollowing, isTransitioning]);

  // 🚌 4. GEOJSON DEL BUS (Para moverlo por hardware y que no parpadee)
  const busGeoJSON = useMemo(() => {
    if (!burritoLocation) return null;
    return {
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        id: 'burrito-bus',
        geometry: { type: 'Point', coordinates: [burritoLocation.longitude, burritoLocation.latitude] },
        properties: { rotation: burritoLocation.heading || 0 }
      }]
    };
  }, [burritoLocation?.latitude, burritoLocation?.longitude, burritoLocation?.heading]);

  return (
    // 🚨 BLINDAJE CONTRA EL DRAWER: collapsable={false} y renderToHardwareTextureAndroid={true} 
    // evitan que Android destruya el mapa al abrir el menú.
    <View style={styles.container} collapsable={false} renderToHardwareTextureAndroid={true}>
      <Mapbox.MapView
        style={styles.map}
        surfaceView={false} // 🚨 Obligatorio para evitar el flash negro en Android
        logoEnabled={false}
        attributionEnabled={false}
        styleURL={isDarkMode ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Street}
        onPress={() => setSelectedStopId(null)} 
        // Si mueves el mapa con el dedo, se apaga el seguimiento automático
        onCameraChanged={(e) => {
          if (e.gestures.isGestureActive) {
            setIsFollowing(false);
          }
        }}
      >
        <Mapbox.Camera 
          ref={cameraRef} 
          defaultSettings={{ centerCoordinate: [-77.0825, -12.0575], zoomLevel: 15.1 }} 
          maxBounds={{
          ne: [-77.0750, -12.0500], // Coordenada Noreste de San Marcos (ajusta a tus valores)
          sw: [-77.0950, -12.0650]  // Coordenada Suroeste de San Marcos (ajusta a tus valores)
          }}
        />
        
        <Mapbox.Images images={{ 'bus-icon': require('../../../assets/bus.png') }} />

        {/* CAPA 1: LA RUTA */}
        <Mapbox.ShapeSource id="routeSource" shape={RUTA_GEOJSON}>
          <Mapbox.LineLayer 
            id="routeLayer" 
            style={{ lineColor: COLORS.primary, lineWidth: 5, lineOpacity: 0.8 }} 
          />
        </Mapbox.ShapeSource>

        {/* CAPA 2: EL BUS NATIVO */}
        {busGeoJSON && (
          <Mapbox.ShapeSource id="busSource" shape={busGeoJSON as any}>
            <Mapbox.SymbolLayer
              id="busLayer"
              style={{
                iconImage: 'bus-icon',
                iconSize: 0.07,
                iconRotate: ['get', 'rotation'],
                iconAllowOverlap: true,
                iconRotationAlignment: 'map',
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {/* CAPA 3: LOS PARADEROS ORIGINALES */}
        {PARADEROS.map((p) => (
          <Mapbox.PointAnnotation 
            key={`stop-${p.id}`} 
            id={p.id} 
            coordinate={[p.longitude, p.latitude]}
            onSelected={() => setSelectedStopId(p.id)} 
          >
            <Icon 
              name="map-marker-radius" 
              size={35} 
              color={COLORS.primary} 
              style={styles.iconShadow} 
            />
          </Mapbox.PointAnnotation>
        ))}

        {/* CAPA 4: TARJETA DEL PARADERO */}
        {selectedStopData && (
          <Mapbox.MarkerView 
            coordinate={[selectedStopData.longitude, selectedStopData.latitude]}
            anchor={{ x: 0.5, y: 1.1 }} 
          >
            <StopCard title={selectedStopData.name} onClose={() => setSelectedStopId(null)} />
          </Mapbox.MarkerView>
        )}
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: { flex: 1 },
  map: { flex: 1 },
  iconShadow: { 
    textShadowColor: 'rgba(0, 0, 0, 0.4)', 
    textShadowOffset: { width: 0, height: 2 }, 
    textShadowRadius: 3 
  }
});