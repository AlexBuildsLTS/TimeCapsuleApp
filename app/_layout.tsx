import '../polyfills';
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as SplashScreen from 'expo-splash-screen';
import { useStore } from '@/store/useStore';
import { AuthForm } from '@/components/AuthForm';
import { Theme } from '@/constants/Theme';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';

// --- BEST PRACTICE: Prevent the splash screen from auto-hiding before asset loading is complete. ---
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  // Load fonts
  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // --- FIX: State to track if the Zustand store has been hydrated ---
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { initializeNotifications } = useStore();

  // Effect to handle store hydration
  useEffect(() => {
    // The persist middleware adds a `onFinishHydration` method to the store's persist object.
    // This is a promise that resolves when the store has been rehydrated from AsyncStorage.
    const unsub = useStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    // An alternative way to check if it has already hydrated on subsequent renders
    if (useStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => {
      unsub();
    };
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // When hydration is complete, hide the splash screen
  useEffect(() => {
    if (isHydrated && fontsLoaded) {
      SplashScreen.hideAsync();

      // Initialize notifications after app is ready
      initializeNotifications().catch(console.error);
    }
  }, [isHydrated, fontsLoaded, initializeNotifications]);

  // --- FIX: Do not render anything until the store is hydrated ---
  if (!isHydrated || !fontsLoaded) {
    return null;
  }

  if (!user) {
    return (
      <LinearGradient colors={Theme.colors.cosmicGradient} style={{ flex: 1 }}>
        <AuthForm />
        <StatusBar style="light" />
      </LinearGradient>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
