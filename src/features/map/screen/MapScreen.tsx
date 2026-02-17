import React, { useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Map } from '../components/Map';
import { useBurritoStore } from '../../../store/burritoLocationStore';

export const MapScreen = () => {
  const { location, isConnecting, actions } = useBurritoStore();

  useEffect(() => {
    actions.startTracking();
    return () => actions.stopTracking();
  }, []);

  return (
    <View style={styles.container}>
      <Map burritoLocation={location} />

      {isConnecting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Conectando con el Burrito...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
});