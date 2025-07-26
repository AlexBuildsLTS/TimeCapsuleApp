import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { UserPlus, LogIn } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// --- FIX: Import from the single, correct config file ---
import { auth } from '../config/firebaseConfig';


export function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isSigningUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} style={styles.container}>
      <Text style={styles.title}>{isSigningUp ? 'Create Your Account' : 'Welcome Back'}</Text>
      <Text style={styles.subtitle}>{isSigningUp ? 'Join to start preserving your memories' : 'Sign in to access your vault'}</Text>
      <View style={styles.inputContainer}>
        <TextInput style={styles.textInput} placeholder="Email" placeholderTextColor={Theme.colors.onSurfaceVariant} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
        <TextInput style={styles.textInput} placeholder="Password" placeholderTextColor={Theme.colors.onSurfaceVariant} value={password} onChangeText={setPassword} secureTextEntry/>
      </View>
      <Pressable onPress={handleAuthAction} style={styles.button}>
        <LinearGradient colors={Theme.colors.accentGradient} style={styles.buttonGradient}>
          {isSigningUp ? <UserPlus size={20} color={Theme.colors.background} /> : <LogIn size={20} color={Theme.colors.background} />}
          <Text style={styles.buttonText}>{loading ? 'Processing...' : isSigningUp ? 'Create Account' : 'Sign In'}</Text>
        </LinearGradient>
      </Pressable>
      <Pressable onPress={() => setIsSigningUp(!isSigningUp)}>
        <Text style={styles.toggleText}>{isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}</Text>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: Theme.spacing.xl, },
    title: { ...Theme.typography.h1, color: Theme.colors.onSurface, textAlign: 'center', marginBottom: Theme.spacing.sm, fontFamily: 'Inter-Bold', },
    subtitle: { ...Theme.typography.body, color: Theme.colors.onSurfaceVariant, textAlign: 'center', marginBottom: Theme.spacing.xxl, fontFamily: 'Inter-Regular', },
    inputContainer: { gap: Theme.spacing.md, marginBottom: Theme.spacing.xl, },
    textInput: { backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.md, padding: Theme.spacing.md, color: Theme.colors.onSurface, fontSize: 16, fontFamily: 'Inter-Regular', borderWidth: 1, borderColor: Theme.colors.primary + '30', },
    button: { borderRadius: Theme.borderRadius.md, overflow: 'hidden', ...Theme.shadows.md, },
    buttonGradient: { padding: Theme.spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Theme.spacing.sm, },
    buttonText: { ...Theme.typography.body, color: Theme.colors.background, fontFamily: 'Inter-Bold', fontSize: 18, },
    toggleText: { ...Theme.typography.body, color: Theme.colors.primary, textAlign: 'center', marginTop: Theme.spacing.xl, fontFamily: 'Inter-SemiBold', },
});