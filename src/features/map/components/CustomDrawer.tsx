import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Switch, Animated, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { COLORS } from '../../../shared/theme/colors';
import { useThemeStore } from '../../../store/themeStore';
import { useDrawerStore } from '../../../store/drawerStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = 280;

export const CustomDrawer = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { isOpen, closeDrawer } = useDrawerStore();
  const [isRendered, setIsRendered] = React.useState(isOpen);
  
  // Animación de deslizamiento
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  // Animación de opacidad del fondo oscuro
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
  if (isOpen) {
    setIsRendered(true); // Montamos el componente antes de que empiece a deslizar
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true })
    ]).start();
  } else {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: -DRAWER_WIDTH, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true })
    ]).start(({ finished }) => {
      if (finished) setIsRendered(false); // Desmontamos solo cuando termina de salir
    });
  }
}, [isOpen]);

  const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDarkMode ? '#A0A0A0' : '#666666';
  const dividerColor = isDarkMode ? '#333333' : '#F0F0F0';
  const iconColor = isDarkMode ? COLORS.primary : '#555555';

  // Si no está abierto y la animación terminó, no permitimos que intercepte toques
  if (!isRendered && !isOpen) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      {/* Fondo oscuro transparente (Toca para cerrar) */}
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
      </TouchableWithoutFeedback>

      {/* El Panel del Drawer que se desliza */}
      <Animated.View style={[styles.drawer, { backgroundColor: bgColor, transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerHeader}>
          <View style={styles.coverPhoto} />
          <View style={styles.userInfoSection}>
            <View style={[styles.avatar, { borderColor: bgColor }]} />
            <Text style={[styles.userName, { color: textColor }]}>Juan Pérez</Text>
            <Text style={[styles.userEmail, { color: subTextColor }]}>juan.perez@unmsm.edu.pe</Text>
          </View>
        </View>

        <View style={[styles.themeSection, { borderTopColor: dividerColor }]}>
          <View style={styles.themeRow}>
            <Icon name="weather-night" size={24} color={iconColor} />
            <Text style={[styles.themeText, { color: textColor }]}>Modo Oscuro</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#555555', true: COLORS.primary }}
            thumbColor={'#FFFFFF'}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 },
  drawer: { position: 'absolute', top: 0, bottom: 0, left: 0, width: DRAWER_WIDTH, zIndex: 11, elevation: 15, shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.25, shadowRadius: 5 },
  drawerHeader: { marginBottom: 20 },
  coverPhoto: { height: 140, backgroundColor: COLORS.primary, opacity: 0.8 },
  userInfoSection: { paddingHorizontal: 20, marginTop: -40 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0E0E0', borderWidth: 3, elevation: 5 },
  userName: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  userEmail: { fontSize: 14 },
  themeSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, marginTop: 10 },
  themeRow: { flexDirection: 'row', alignItems: 'center' },
  themeText: { fontSize: 16, marginLeft: 15, fontWeight: '500' }
});