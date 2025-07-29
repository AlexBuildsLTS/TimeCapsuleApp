import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Mail, Lock, User, Sparkles } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { auth } from '@/config/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useStore } from '@/store/useStore';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { initializeNotifications } = useStore();

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isSignUp && !name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.trim(),
          password
        );

        // Update profile with name
        await updateProfile(userCredential.user, {
          displayName: name.trim(),
        });

        Alert.alert('Success', 'Account created successfully!');
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      // Initialize notifications after successful auth
      await initializeNotifications();
    } catch (error: any) {
      console.error('Auth error:', error);

      let errorMessage = 'An error occurred';

      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address';
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/invalid-credential':
          errorMessage =
            'Invalid credentials. Please check your email and password.';
          break;
        default:
          errorMessage = error.message || 'Authentication failed';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <Sparkles size={48} color={Theme.colors.primary} />
        <Text style={styles.title}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? 'Start your journey through time'
            : 'Continue your time travel adventure'}
        </Text>
      </View>

      <View style={styles.form}>
        {isSignUp && (
          <View style={styles.inputContainer}>
            <User size={20} color={Theme.colors.onSurfaceVariant} />
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor={Theme.colors.onSurfaceVariant}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Mail size={20} color={Theme.colors.onSurfaceVariant} />
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor={Theme.colors.onSurfaceVariant}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Lock size={20} color={Theme.colors.onSurfaceVariant} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Theme.colors.onSurfaceVariant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <Pressable
          onPress={handleAuth}
          disabled={loading}
          style={styles.authButton}
        >
          <LinearGradient
            colors={Theme.colors.accentGradient}
            style={styles.authButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color={Theme.colors.background} />
            ) : (
              <Text style={styles.authButtonText}>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable
          onPress={() => setIsSignUp(!isSignUp)}
          style={styles.switchButton}
        >
          <Text style={styles.switchText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </Pressable>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xxl,
  },
  title: {
    ...Theme.typography.h1,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: Theme.spacing.sm,
  },
  form: {
    gap: Theme.spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    gap: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  input: {
    flex: 1,
    color: Theme.colors.onSurface,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  authButton: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    marginTop: Theme.spacing.md,
  },
  authButtonGradient: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  authButtonText: {
    color: Theme.colors.background,
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  switchButton: {
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  switchText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});
