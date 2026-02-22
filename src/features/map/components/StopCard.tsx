import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../shared/theme/colors';

interface Props {
  title: string;
  onClose: () => void; // 🛠️ Nueva función para manejar el cierre
}

export const StopCard = ({ title, onClose }: Props) => {
  return (
    <View style={styles.cardContainer}>
      {/* Contenedor de Textos (Izquierda) */}
      <View style={styles.textWrapper}>
        <Text style={styles.badgeLabel}>Paradero</Text> {/* 🛠️ Texto corregido */}
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>

      {/* Botón de Cerrar 'X' (Derecha) */}
      <TouchableOpacity onPress={onClose} style={styles.closeButton} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Icon name="close" size={24} color="#9CA3AF" /> {/* Gris suave */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Alineado arriba por si el nombre tiene 2 líneas
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: '90%', // Ocupará casi todo el ancho de la pantalla
    alignSelf: 'center', // Centrado horizontalmente
    // Sombras premium para que flote de verdad
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  textWrapper: {
    flex: 1, // Toma todo el espacio disponible menos el de la X
    marginRight: 10,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary, // Usamos el color de la app
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 18, // Un poco más grande y legible
    fontWeight: 'bold',
    color: '#111827', // Negro casi puro
  },
  closeButton: {
    padding: 4, // Un poco de área táctil extra
    marginTop: -4, // Ajuste fino para alinearlo visualmente con el título
  }
});