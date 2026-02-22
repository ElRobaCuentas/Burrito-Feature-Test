import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../shared/theme/colors';

interface FABProps {
  isFollowingBus: boolean;
  onFollowBus: () => void;
  onCenterMap: () => void;
}

export const FAB = ({ isFollowingBus, onFollowBus, onCenterMap }: FABProps) => {
  return (
    <View style={styles.container}>
      
      {/* Botón de Centrado Panorámico */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={onCenterMap} 
        activeOpacity={0.8}
      >
        <Icon name="map-outline" size={24} color="#1A1A1A" />
      </TouchableOpacity>

      {/* Botón de Seguimiento al Burrito */}
      <TouchableOpacity 
        style={[styles.button, isFollowingBus && styles.buttonActive]} 
        onPress={onFollowBus} 
        activeOpacity={0.8}
      >
        <Icon 
          name={isFollowingBus ? "crosshairs-gps" : "crosshairs"} 
          size={24} 
          color={isFollowingBus ? "#FFFFFF" : "#1A1A1A"} 
        />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40, 
    right: 20,
    flexDirection: 'column',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15, 
  },
  buttonActive: {
    backgroundColor: COLORS.primary, 
  }
});