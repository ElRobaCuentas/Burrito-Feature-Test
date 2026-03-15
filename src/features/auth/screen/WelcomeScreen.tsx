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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParams } from '../../../app/navigations/StackNavigator';
import { TYPOGRAPHY }  from '../../../shared/theme/typography';

type NavProp = StackNavigationProp<RootStackParams, 'WelcomeScreen'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<NavProp>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* ── LOGO ── */}
      <Animated.View
        // entering={FadeInUp.delay(200).springify().damping(25)}
        style={[styles.logoWrapper, { marginTop: insets.top + 20 }]}
      >
        <Image
          source={require('../../../assets/bus_logo.png')}
          style={{ width: width * 0.9, height: width * 0.9 }}
          resizeMode="contain"
        />
      </Animated.View>

      {/* ── SLOGAN GIGANTE (HOOK) ── */}
      <Animated.View 
        // entering={FadeInUp.delay(350).springify().damping(25)} 
        style={styles.textContainer}
        >
        <Text style={styles.slogan}>
          Tu bus universitario{'\n'}
          <Text style={styles.sloganHighlight}>en tiempo real</Text>
        </Text>
      </Animated.View>

      {/* ── BOTONES ── */}
      <Animated.View
        // entering={FadeInDown.delay(500).springify().damping(25)}
        style={[styles.btnContainer, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* LOGIN */}
        <TouchableOpacity
          style={styles.btnLogin}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SignInScreen')}
        >
          <Text style={styles.btnLoginText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        {/* REGISTER */}
        <TouchableOpacity
          style={styles.btnRegister}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('SignUpScreen')}
        >
          <Text style={styles.btnRegisterText}>Regístrate</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo blanco puro
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1.3, 
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 50,
    paddingHorizontal: 40,
  },
  slogan: {
    fontSize: 38,
    fontFamily: TYPOGRAPHY.primary.bold,
    color: '#121F27',
    textAlign: 'center',
    lineHeight: 46,
    letterSpacing: -1,
  },
  sloganHighlight: {
    color: '#00AEEF', 
    fontSize: 40,
  },
  btnContainer: {
    width: '100%',
    paddingHorizontal: 32, 
    gap: 16, 
  },
  btnLogin: {
    backgroundColor: '#00AEEF', 
    borderRadius: 18, 
    paddingVertical: 18, 
    alignItems: 'center',
    // Sombra más sutil para fondo blanco
    shadowColor: '#00AEEF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  btnLoginText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: TYPOGRAPHY.primary.bold,
    letterSpacing: 0.5,
  },
  btnRegister: {
    backgroundColor: '#F8FAFC', // Un blanco grisáceo muy leve para dar contraste
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