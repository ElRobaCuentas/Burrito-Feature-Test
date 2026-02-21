import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Map } from '../components/Map';
import { useBurritoStore } from '../../../store/burritoLocationStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { COLORS } from '../../../shared/theme/colors';

export const MapScreen = () => {
  const { location, actions } = useBurritoStore();
  const navigation = useNavigation();

  useEffect(() => {
    actions.startTracking();
    return () => actions.stopTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Map burritoLocation={location} />

      <SafeAreaView style={styles.hamburgerContainer}>
        <TouchableOpacity 
          activeOpacity={0.6}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Icon name="menu" size={36} color={COLORS.primary} style={styles.iconShadow} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  hamburgerContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 100,
  },
  iconShadow: {
    textShadowColor: 'rgba(255, 255, 255, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  }
});