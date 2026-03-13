import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParams } from '../../../app/navigations/StackNavigator';
import { COLORS }      from '../../../shared/theme/colors';
import { TYPOGRAPHY }  from '../../../shared/theme/typography';

type NavProp = StackNavigationProp<RootStackParams, 'WelcomeScreen'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      // 🔥 Ahora el azul empieza en el fondo (suelo) y se desvanece a blanco hacia arriba
      colors={['#00AEEF', '#80D6F7', '#FFFFFF', '#FFFFFF']}
      start={{ x: 0, y: 0}} // Empieza abajo (1)
      end={{ x: 0, y: 0.3}} // Sube difuminándose hasta un poco más arriba de la mitad
      style={styles.container}
    >
      {/* ── LOGO ── */}
      <Animated.View
        entering={FadeInUp.delay(200).springify().damping(14)}
        style={[styles.logoWrapper, { marginTop: insets.top + 20 }]}
      >
        <Image
          source={require('../../../assets/bus_logo.png')}
          style={{ width: width * 0.8, height: width * 0.8 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ── SLOGAN GIGANTE (HOOK) ── */}
      <Animated.View entering={FadeInUp.delay(350).springify().damping(14)} style={styles.textContainer}>
        <Text style={styles.slogan}>
          Tu bus universitario{'\n'}
          <Text style={styles.sloganHighlight}>en tiempo real</Text>
        </Text>
      </Animated.View>

      {/* ── BOTONES ── */}
      <Animated.View
        entering={FadeInDown.delay(500).springify().damping(14)}
        style={[styles.btnContainer, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* LOGIN */}
        <TouchableOpacity
          style={styles.btnLogin}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SignInScreen')}
        >
          <Text style={styles.btnLoginText}>Login</Text>
        </TouchableOpacity>

        {/* REGISTER */}
        <TouchableOpacity
          style={styles.btnRegister}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={styles.btnRegisterText}>Register</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.3, 
    // Añadimos una sombra oscura detrás del bus para que resalte brutal contra el cielo celeste
    shadowColor: '#004C6A', 
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 20,
  },
  slogan: {
    // 🔥 La frase ahora es la protagonista: Gigante, gruesa y con impacto
    fontSize: 38,
    fontFamily: TYPOGRAPHY.primary.bold,
    color: '#121F27',
    textAlign: 'center',
    lineHeight: 46,
    letterSpacing: -1,
  },
  sloganHighlight: {
    // La segunda parte resalta en el color oficial para darle punch
    color: '#00AEEF', 
    fontSize: 40,
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: 32, 
    gap: 16, 
  },
  btnLogin: {
    // Como el fondo de arriba es azul, este botón oscuro rompe súper elegante abajo (que es blanco)
    backgroundColor: '#00AEEF', 
    borderRadius: 18, 
    paddingVertical: 18, 
    alignItems: 'center',
    shadowColor: '#121F27',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  btnLoginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: TYPOGRAPHY.primary.bold,
    letterSpacing: 0.5,
  },
  btnRegister: {
    backgroundColor: '#FFFFFF', 
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  btnRegisterText: {
    color: '#121F27',
    fontSize: 18,
    fontFamily: TYPOGRAPHY.primary.bold,
    letterSpacing: 0.5,
  },
});