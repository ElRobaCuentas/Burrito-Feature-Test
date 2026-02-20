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
        {/* La X ahora es solo un elemento visual. El cierre lo maneja el Callout. */}
        <View style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </View>
        
        <View style={styles.info}>
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
    width: 150 
  },
  card: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    paddingTop: 15,
    paddingBottom: 5,
  },
  info: { 
    padding: 10, 
    alignItems: 'center', 
    width: '100%' 
  },
  title: { 
    fontSize: 13, 
    fontWeight: '900', 
    color: COLORS.primary, 
    textAlign: 'center' 
  },
  closeButton: {
    position: 'absolute', 
    top: 5, 
    right: 5, 
    backgroundColor: '#FF0000',
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center', 
    zIndex: 99,
  },
  closeText: { 
    color: 'white', 
    fontSize: 10, 
    fontWeight: 'bold' 
  },
  arrow: {
    width: 0, 
    height: 0, 
    borderLeftWidth: 10, 
    borderRightWidth: 10,
    borderTopWidth: 12, 
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent', 
    borderTopColor: COLORS.primary,
    marginTop: -2
  },
});