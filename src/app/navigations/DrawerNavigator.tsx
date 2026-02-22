import React, { useEffect } from 'react';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Switch, useColorScheme } from 'react-native'; 
import { MapScreen } from '../../features/map/screen/MapScreen';
import { COLORS } from '../../shared/theme/colors';
import { useThemeStore } from '../../store/themeStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

// 🛠️ REGRESAMOS EL DISEÑO DEL DRAWER AQUÍ MISMO PARA EVITAR EL ERROR DE IMPORT
const CustomDrawerContent = (props: any) => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const bgColor = isDarkMode ? '#1E1E1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#1A1A1A';
  const subTextColor = isDarkMode ? '#A0A0A0' : '#666666';
  const dividerColor = isDarkMode ? '#333333' : '#F0F0F0';
  const iconColor = isDarkMode ? COLORS.primary : '#555555';

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }} style={{ backgroundColor: bgColor }}>
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
    </DrawerContentScrollView>
  );
};

export const DrawerNavigator = () => {
  const systemColorScheme = useColorScheme(); 
  const { setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      // 🚨 LA CURA 1: Prohíbe que React Navigation desmonte la pantalla del mapa
      detachInactiveScreens={false} 
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280 },
        drawerType: 'front', // Flota encima, no empuja
        overlayColor: 'rgba(0,0,0,0.5)',
      } as any} // 🛠️ Silenciamos TypeScript con "any" para evitar conflictos de versión
    >
      <Drawer.Screen 
        name="MapScreen" 
        component={MapScreen} 
        // 🚨 LA CURA 2: Movida a Screen. Evita que la pantalla se congele al perder el foco.
        options={{ unmountOnBlur: false } as any} 
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
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