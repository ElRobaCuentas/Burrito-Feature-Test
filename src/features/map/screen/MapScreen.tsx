import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useBurritoStore } from '../../../store/burritoLocationStore';
import { useThemeStore } from '../../../store/themeStore';
import { useMapStore } from '../../../store/mapStore'; 
import { useDrawerStore } from '../../../store/drawerStore'; // 👈 Nuestro nuevo store
import { Map } from '../components/Map';
import { FAB } from '../components/FAB';
import { CustomDrawer } from '../components/CustomDrawer'; // 👈 Nuestro menú personalizado
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../shared/theme/colors';
import Mapbox from '@rnmapbox/maps';

export const MapScreen = () => {
  const { location, actions } = useBurritoStore();
  const { isDarkMode } = useThemeStore();
  const { isFollowing, setCommand } = useMapStore(); 
  const { openDrawer } = useDrawerStore(); // 👈 Ya no usamos react-navigation para esto

  useEffect(() => {
    actions.startTracking();
  }, []);

  return (
    <View style={styles.container}>
      {/* 🗺️ EL MAPA: Intocable, siempre vivo, recibe tus dedos al 100% */}
      <Map burritoLocation={location} isDarkMode={isDarkMode} />

      {/* 🛠️ CAPA UI: pointerEvents="box-none" permite tocar el mapa */}
      <View style={styles.uiLayer} pointerEvents="box-none">
        <SafeAreaView style={styles.hamburgerContainer}>
          <TouchableOpacity onPress={openDrawer}>
            <Icon name="menu" size={36} color={COLORS.primary} style={styles.iconShadow} />
          </TouchableOpacity>
        </SafeAreaView>

        <FAB 
          isFollowingBus={isFollowing} 
          onFollowBus={() => setCommand('follow')}
          onCenterMap={() => setCommand('center')}
        />
      </View>

      {/* 📦 NUESTRO DRAWER FLOTANTE: Vive encima de todo, sin destruir el mapa */}
      <CustomDrawer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  uiLayer: { ...StyleSheet.absoluteFillObject },
  hamburgerContainer: { position: 'absolute', top: 40, left: 20 },
  iconShadow: { textShadowColor: 'rgba(255, 255, 255, 0.9)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }
});