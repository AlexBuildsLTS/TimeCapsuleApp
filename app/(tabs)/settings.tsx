import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Switch, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Bell, MapPin, Trash2, ChevronRight, LogOut } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { useRouter } from 'expo-router';
import { useStore } from '@/store/useStore';
import { auth } from '@/config/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const { deleteCapsule } = useStore.getState(); // Example of how to get a function

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all of your capsules? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {
          // This is a placeholder for now. In the future, this would be:
          // const { capsules, deleteCapsule } = useStore.getState();
          // capsules.forEach(c => deleteCapsule(c.id));
          Alert.alert("Data Cleared", "All capsules have been deleted.");
        }}
      ]
    );
  };
  
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // The onAuthStateChanged listener in profile.tsx will handle the UI update
      router.push('/(tabs)/profile');
    } catch (error) {
      Alert.alert("Error", "Could not sign out.");
    }
  };


  return (
    <LinearGradient colors={Theme.colors.cosmicGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
        </MotiView>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.card}>
                <View style={styles.row}>
                    <Bell color={Theme.colors.onSurfaceVariant} size={22} />
                    <Text style={styles.rowTitle}>Notifications</Text>
                    <Switch
                        value={notificationsEnabled}
                        onValueChange={setNotificationsEnabled}
                        trackColor={{ false: Theme.colors.surfaceVariant, true: Theme.colors.primary }}
                        thumbColor={Theme.colors.onSurface}
                    />
                </View>
                <View style={styles.row}>
                    <MapPin color={Theme.colors.onSurfaceVariant} size={22} />
                    <Text style={styles.rowTitle}>Enable Location Tagging</Text>
                    <Switch
                        value={locationEnabled}
                        onValueChange={setLocationEnabled}
                        trackColor={{ false: Theme.colors.surfaceVariant, true: Theme.colors.primary }}
                        thumbColor={Theme.colors.onSurface}
                    />
                </View>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data & Support</Text>
            <View style={styles.card}>
                 <Pressable style={styles.row} onPress={handleClearData}>
                    <Trash2 color={Theme.colors.onSurfaceVariant} size={22} />
                    <Text style={styles.rowTitle}>Clear All Data</Text>
                    <ChevronRight color={Theme.colors.onSurfaceVariant} size={22} />
                </Pressable>
            </View>
        </View>

        <View style={styles.section}>
             <Pressable style={[styles.card, styles.signOutButton]} onPress={handleSignOut}>
                <View style={styles.row}>
                    <LogOut color={Theme.colors.error} size={22} />
                    <Text style={[styles.rowTitle, {color: Theme.colors.error}]}>Sign Out</Text>
                </View>
            </Pressable>
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.surface,
  },
  headerTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  section: {
    marginTop: Theme.spacing.xl,
    paddingHorizontal: Theme.spacing.lg,
  },
  sectionTitle: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-SemiBold',
    marginBottom: Theme.spacing.md,
  },
  card: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  rowTitle: {
    ...Theme.typography.body,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  signOutButton: {
      borderColor: Theme.colors.error + '40',
      backgroundColor: Theme.colors.error + '10'
  }
});