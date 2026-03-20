import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { firebaseAuth }  from '../../../shared/config/firebase';
import { COLORS }        from '../../../shared/theme/colors';
import { TYPOGRAPHY }    from '../../../shared/theme/typography';

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const insets     = useSafeAreaInsets();

  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const handleSend = async () => {
  if (!email.trim()) {
    Alert.alert('Campo vacío', 'Ingresa tu correo electrónico.');
    return;
  }

  setLoading(true);
  try {
    await firebaseAuth.sendPasswordResetEmail(email.trim());
    setSent(true);

  } catch (error: any) {
    if (error.code === 'auth/network-request-failed') {
      Alert.alert('Sin conexión', 'Verifica tu conexión a internet e inténtalo de nuevo.');
    } else if (error.code === 'auth/invalid-email') {
      Alert.alert('Correo inválido', 'El formato del correo no es válido.');
    } else {
      setSent(true);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 30 }]}>

        {/* BACK */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={28} color="#1A1A1A" />
        </TouchableOpacity>

        {/* TÍTULO */}
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>¿Olvidaste tu{'\n'}contraseña?</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </Text>
        </View>

        {/* FORMULARIO o ÉXITO */}
        {!sent ? (
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Tu correo electrónico"
                placeholderTextColor="#AAAAAA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              style={[styles.btnSend, loading && styles.btnDisabled]}
              activeOpacity={0.85}
              onPress={handleSend}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.btnSendText}>Enviar enlace</Text>
              }
            </TouchableOpacity>
          </View>
        ) : (
          // ── Estado de éxito ──
          <View style={styles.successBox}>
            <View style={styles.successIconCircle}>
              <Icon name="email-check-outline" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.successTitle}>¡Correo enviado!</Text>
            <Text style={styles.successMsg}>
              Si existe una cuenta con{' '}
              <Text style={{ fontFamily: TYPOGRAPHY.primary.semiBold, color: '#1A1A1A' }}>
                {email}
              </Text>
              , recibirás un enlace para restablecer tu contraseña. Revisa también la carpeta de spam.
            </Text>

            <TouchableOpacity
              style={styles.btnBack}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.btnBackText}>Volver al Login</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, paddingHorizontal: 24 },

  backBtn: { width: 40, height: 40, justifyContent: 'center' },

  titleWrapper: { marginTop: 16, marginBottom: 36 },
  title: {
    fontSize: 32,
    fontFamily: TYPOGRAPHY.primary.bold,
    color: '#1A1A1A',
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.primary.regular,
    color: '#888',
    lineHeight: 21,
  },

  form:         { gap: 16 },
  inputWrapper: {
    backgroundColor: '#F4F4F4',
    borderRadius: 14,
  },
  input: {
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 15,
    fontFamily: TYPOGRAPHY.primary.regular,
    color: '#1A1A1A',
  },

  btnSend: {
    backgroundColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
  },
  btnDisabled: { opacity: 0.6 },
  btnSendText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: TYPOGRAPHY.primary.semiBold,
  },

  // ── Éxito ──
  successBox: {
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  successIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: TYPOGRAPHY.primary.bold,
    color: '#1A1A1A',
    marginBottom: 12,
  },
  successMsg: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.primary.regular,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 36,
  },
  btnBack: {
    borderWidth: 1.5,
    borderColor: '#1A1A1A',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  btnBackText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.primary.semiBold,
    color: '#1A1A1A',
  },
});