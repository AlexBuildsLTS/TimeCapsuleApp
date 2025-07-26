import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { User, Settings, LogOut, Trash2 } from 'lucide-react-native';
import { useStore } from '@/store/useStore';
import { Theme } from '@/constants/Theme';
import { AuthForm } from '@/components/AuthForm';
import { auth } from '../../config/firebaseConfig';
import {
  onAuthStateChanged,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { useRouter } from 'expo-router'; // <-- Import useRouter

export default function ProfileScreen() {
  const { capsules } = useStore();
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const router = useRouter(); // <-- Initialize router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Error', 'Could not sign out.');
    }
  };

  if (!firebaseUser) {
    return (
      <LinearGradient
        colors={Theme.colors.cosmicGradient}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <AuthForm />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const totalCapsules = capsules.length;
  const unlockedCapsules = capsules.filter((c) => c.isUnlocked).length;
  const sealedCapsules = totalCapsules - unlockedCapsules;

  return (
    <LinearGradient
      colors={Theme.colors.cosmicGradient}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.header}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={Theme.colors.accentGradient}
                style={styles.avatar}
              >
                <User size={32} color={Theme.colors.background} />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>Future Traveler</Text>
            <Text style={styles.userEmail}>{firebaseUser.email}</Text>
          </MotiView>

          {/* Stats */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 200 }}
            style={styles.statsSection}
          >
            <Text style={styles.sectionTitle}>Your Journey</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{totalCapsules}</Text>
                <Text style={styles.statLabel}>Total Capsules</Text>
              </View>
              <View style={styles.statCard}>
                <Text
                  style={[styles.statNumber, { color: Theme.colors.success }]}
                >
                  {unlockedCapsules}
                </Text>
                <Text style={styles.statLabel}>Unlocked</Text>
              </View>
              <View style={styles.statCard}>
                <Text
                  style={[styles.statNumber, { color: Theme.colors.primary }]}
                >
                  {sealedCapsules}
                </Text>
                <Text style={styles.statLabel}>Sealed</Text>
              </View>
            </View>
          </MotiView>

          {/* Settings */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600 }}
            style={styles.settingsSection}
          >
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsList}>
              {/* --- LINK TO THE NEW SETTINGS SCREEN --- */}
              <Pressable
                style={styles.settingItem}
                onPress={() => router.push('/(tabs)/settings')}
              >
                <Settings size={20} color={Theme.colors.onSurfaceVariant} />
                <Text style={styles.settingText}>App Settings</Text>
              </Pressable>
            </View>
          </MotiView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { alignItems: 'center', padding: Theme.spacing.xl },
  avatarContainer: { marginBottom: Theme.spacing.md },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    ...Theme.typography.h2,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginBottom: Theme.spacing.xs,
  },
  userEmail: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  sectionTitle: {
    ...Theme.typography.h3,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginBottom: Theme.spacing.lg,
    paddingHorizontal: Theme.spacing.lg,
  },
  statsSection: { marginBottom: Theme.spacing.xl },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  statNumber: {
    ...Theme.typography.h2,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    ...Theme.typography.caption,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  settingsSection: { marginBottom: Theme.spacing.xl },
  settingsList: { paddingHorizontal: Theme.spacing.lg, gap: Theme.spacing.sm },
  settingItem: {
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  settingText: {
    ...Theme.typography.body,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Regular',
  },
});
