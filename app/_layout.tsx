import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as SplashScreen from 'expo-splash-screen';
import { useStore } from '@/store/useStore';

// --- BEST PRACTICE: Prevent the splash screen from auto-hiding before asset loading is complete. ---
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  // --- FIX: State to track if the Zustand store has been hydrated ---
  const [isHydrated, setIsHydrated] = useState(false);

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

  // When hydration is complete, hide the splash screen
  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [isHydrated]);

  // --- FIX: Do not render anything until the store is hydrated ---
  if (!isHydrated) {
    return null;
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
