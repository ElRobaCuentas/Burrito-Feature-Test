import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../shared/theme/colors';

interface StopCardProps {
  title: string;
}

export const StopCard = ({ title }: StopCardProps) => {
  return (
    <View style={styles.bubbleContainer}>
      <View style={styles.card}>
        <View style={styles.header} />
        
        <View style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </View>
        
        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </View>
      <View style={styles.arrow} />
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: { 
    alignItems: 'center', 
    width: 160, 
    paddingBottom: 5 
  },
  card: {
    width: '100%',
    height: 85, //LE PUSE UNA ALTURA DEFINIDA A LA CARD
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  header: {
    backgroundColor: COLORS.primary, 
    height: 35,
    width: '100%',
  },
  body: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10, 
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontSize: 14, 
    fontWeight: '800', 
    color: '#1A1A1A', 
    textAlign: 'center',
    marginTop: 4,
  },
  closeButton: {
    position: 'absolute', 
    top: 23, 
    right: 15, 
    backgroundColor: COLORS.primary,
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    justifyContent: 'center',
    alignItems: 'center', 
    zIndex: 99,
    borderWidth: 2,
    borderColor: '#FFFFFF', 
    elevation: 3, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  closeText: { 
    color: '#FFFFFF', 
    fontSize: 10, 
    fontWeight: 'bold',
    lineHeight: 14,
  },
  arrow: {
    width: 0, 
    height: 0, 
    borderLeftWidth: 9, 
    borderRightWidth: 9,
    borderTopWidth: 11, 
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent', 
    borderTopColor: '#FFFFFF',
    marginTop: -1.5, 
  },
});