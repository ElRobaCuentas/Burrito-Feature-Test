import React, { useRef, useEffect, useState, memo } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Polyline, AnimatedRegion, Region, MapMarker } from 'react-native-maps';
import { Image, StyleSheet, View } from 'react-native';
import { BurritoLocation } from '../types';
import { COLORS } from '../../../shared/theme/colors';
import { StopCard } from './StopCard';
import { FAB } from './FAB'; 
import { darkMapStyle } from '../constants/mapTheme'; 
import { 
  UNMSM_LOCATION, RUTA_OFICIAL, PARADEROS, SOUTH_WEST, NORTH_EAST 
} from '../constants/map_route';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const lightMapStyle: any[] = []; 

interface Props {
  burritoLocation: BurritoLocation | null;
  isDarkMode: boolean; // 👈 Ahora lo recibe como propiedad
}

const isOutsideBounds = (region: Region) => (
  region.latitude < SOUTH_WEST.latitude || region.latitude > NORTH_EAST.latitude ||
  region.longitude < SOUTH_WEST.longitude || region.longitude > NORTH_EAST.longitude
);

// 👇 SEPARAMOS EL COMPONENTE PARA PODER MEMOIZARLO
const MapComponent = ({ burritoLocation, isDarkMode }: Props) => {
  const mapRef = useRef<MapView>(null);
  const isAnimatingRef = useRef(false);
  const markerRefs = useRef<{ [key: string]: MapMarker | null }>({});
  const [isFollowingBus, setIsFollowingBus] = useState(true);

  const burritoPosition = useRef(
    new AnimatedRegion({
      latitude: UNMSM_LOCATION.latitude, longitude: UNMSM_LOCATION.longitude,
      latitudeDelta: 0, longitudeDelta: 0,
    })
  ).current;

  useEffect(() => {
    if (burritoLocation) {
      burritoPosition.timing({
        latitude: burritoLocation.latitude, longitude: burritoLocation.longitude,
        duration: 2500, useNativeDriver: false,
      } as any).start();

      if (isFollowingBus) {
        mapRef.current?.animateToRegion({
          latitude: burritoLocation.latitude, longitude: burritoLocation.longitude,
          latitudeDelta: 0.005, longitudeDelta: 0.005,
        }, 1000);
      }
    }
  }, [burritoLocation, isFollowingBus]);

  const handleFollowBus = () => {
    setIsFollowingBus(true);
    if (burritoLocation) {
      mapRef.current?.animateToRegion({
        latitude: burritoLocation.latitude, longitude: burritoLocation.longitude,
        latitudeDelta: 0.005, longitudeDelta: 0.005,
      }, 1000);
    }
  };

  const handleCenterMap = () => {
    setIsFollowingBus(false);
    mapRef.current?.animateToRegion(UNMSM_LOCATION, 1000);
  };

  const handleRegionChangeComplete = (region: Region) => {
    if (isAnimatingRef.current) return;
    if (isOutsideBounds(region)) {
      setIsFollowingBus(false);
      isAnimatingRef.current = true;
      mapRef.current?.animateToRegion(UNMSM_LOCATION, 600);
      setTimeout(() => { isAnimatingRef.current = false; }, 700);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={UNMSM_LOCATION}
        minZoomLevel={15}
        moveOnMarkerPress={false} 
        onRegionChangeComplete={handleRegionChangeComplete}
        onPanDrag={() => setIsFollowingBus(false)} 
        customMapStyle={isDarkMode ? darkMapStyle : lightMapStyle} 
      >
        <Polyline coordinates={RUTA_OFICIAL} strokeColor={COLORS.primary} strokeWidth={6} lineCap="round" lineJoin="round" tappable={false} zIndex={-1} />
        {PARADEROS.map((p) => (
          <Marker
            key={p.id} 
            ref={(ref) => { if (ref) markerRefs.current[p.id] = ref; }}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            anchor={{ x: 0.5, y: 1 }} calloutAnchor={{ x: 0.5, y: 0.15 }} tracksViewChanges={false} zIndex={10}
            onPress={(e) => { e.stopPropagation(); markerRefs.current[p.id]?.showCallout(); }}
          >
            <View style={styles.iconContainer}>
              <Icon name="map-marker-radius" size={35} color={COLORS.primary} style={styles.iconShadow} />
            </View>
            <Callout tooltip onPress={(e) => { e.stopPropagation(); markerRefs.current[p.id]?.hideCallout(); }}>
              <StopCard title={p.name} />
            </Callout>
          </Marker>
        ))}
        {burritoLocation && (
          <Marker.Animated coordinate={burritoPosition as any} rotation={burritoLocation.heading || 0} flat anchor={{ x: 0.5, y: 0.5 }} zIndex={50}>
            <View style={styles.busContainer}>
              <Image source={require('../../../assets/bus.png')} style={styles.busImage} />
            </View>
          </Marker.Animated>
        )}
      </MapView>
      <FAB isFollowingBus={isFollowingBus} onFollowBus={handleFollowBus} onCenterMap={handleCenterMap} />
    </View>
  );
};

// 👇 EL ESCUDO MÁGICO: Solo se re-renderiza si cambian estas variables exactas
export const Map = memo(MapComponent, (prevProps, nextProps) => {
  return (
    prevProps.isDarkMode === nextProps.isDarkMode &&
    prevProps.burritoLocation?.latitude === nextProps.burritoLocation?.latitude &&
    prevProps.burritoLocation?.longitude === nextProps.burritoLocation?.longitude
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { ...StyleSheet.absoluteFillObject },
  iconContainer: { width: 45, height: 45, justifyContent: 'center', alignItems: 'center' },
  iconShadow: { textShadowColor: 'rgba(255, 255, 255, 0.9)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 8 },
  busContainer: { width: 45, height: 45 },
  busImage: { width: '100%', height: '100%', resizeMode: 'contain' },
});