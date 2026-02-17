import React from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';
import { BurritoLocation } from '../types';

const UNMSM_LOCATION = {
  latitude: -12.0560,
  longitude: -77.0844,
  latitudeDelta: 0.012,
  longitudeDelta: 0.012,
};

interface Props {
  burritoLocation: BurritoLocation | null;
}

export const Map = ({ burritoLocation }: Props) => {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      showsUserLocation={false}
      initialRegion={UNMSM_LOCATION}
    >
      {burritoLocation && (
        <Marker
          coordinate={{
            latitude: burritoLocation.latitude,
            longitude: burritoLocation.longitude,
          }}
          rotation={burritoLocation.heading}
          title="Burrito"
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});