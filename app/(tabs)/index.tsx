import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from '@shopify/flash-list';
import { MotiView } from 'moti';
import { Plus, Sparkles } from 'lucide-react-native';
import { useStore } from '@/store/useStore';
import { CapsuleCard } from '@/components/CapsuleCard';
import { UnlockNotification } from '@/components/UnlockNotification';
import { UnlockCeremony } from '@/components/UnlockCeremony';
import { Theme } from '@/constants/Theme';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/config/firebaseConfig';

export default function VaultScreen() {
  // --- CORE LOGIC: We get the sync functions and user from the store ---
  const {
    capsules,
    unlockCapsule,
    initializeFirestoreSync,
    stopFirestoreSync,
    setCurrentUser,
  } = useStore();
  const router = useRouter();
  const [currentUser, setCurrentUserLocal] = useState<User | null>(
    auth.currentUser
  );

  // --- CORE LOGIC: Set up auth listener and Firestore sync ---
  useEffect(() => {
    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUserLocal(user);
      // This now correctly updates the global store with the user object
      const storeUser = user
        ? {
            id: user.uid,
            name: user.displayName || 'Future Traveler',
            email: user.email || '',
          }
        : null;
      setCurrentUser(storeUser);

      if (user) {
        // If user logs in, start syncing their data
        initializeFirestoreSync();
      } else {
        // If user logs out, stop syncing
        stopFirestoreSync();
      }
    });

    // Cleanup listeners on component unmount
    return () => {
      authUnsubscribe();
      stopFirestoreSync();
    };
  }, [initializeFirestoreSync, stopFirestoreSync, setCurrentUser]);

  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showUnlockNotification, setShowUnlockNotification] = useState<
    string | null
  >(null);
  const [showUnlockCeremony, setShowUnlockCeremony] = useState<string | null>(
    null
  );
  const [dismissedNotifications, setDismissedNotifications] = useState<
    string[]
  >([]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const { sealedCount, readyCount, openedCount, sortedCapsules } =
    useMemo(() => {
      const now = Date.now();
      const sealed = capsules.filter((c) => c.unlockDate > now && c.isSealed);
      const ready = capsules.filter(
        (c) => c.unlockDate <= now && !c.isUnlocked
      );
      const opened = capsules.filter((c) => c.isUnlocked);

      const sorted = [...capsules].sort((a, b) => {
        const aIsReady = a.unlockDate <= now && !a.isUnlocked;
        const bIsReady = b.unlockDate <= now && !b.isUnlocked;
        if (aIsReady && !bIsReady) return -1;
        if (!aIsReady && bIsReady) return 1;
        if (a.isUnlocked && !b.isUnlocked) return 1;
        if (!a.isUnlocked && b.isUnlocked) return -1;
        return b.createdAt - a.createdAt;
      });

      return {
        sealedCount: sealed.length,
        readyCount: ready.length,
        openedCount: opened.length,
        sortedCapsules: sorted,
      };
    }, [capsules]);

  useEffect(() => {
    const unlockableCapsule = capsules.find(
      (c) =>
        c.unlockDate <= Date.now() &&
        !c.isUnlocked &&
        c.isSealed &&
        !dismissedNotifications.includes(c.id)
    );
    if (unlockableCapsule && !showUnlockNotification && !showUnlockCeremony) {
      setShowUnlockNotification(unlockableCapsule.id);
    }
  }, [
    currentTime,
    capsules,
    showUnlockNotification,
    showUnlockCeremony,
    dismissedNotifications,
  ]);

  const handleCreateCapsule = () => router.push('/(tabs)/create');
  const handleUnlockCapsule = (capsuleId: string) => {
    setShowUnlockNotification(null);
    setShowUnlockCeremony(capsuleId);
  };
  const handleDismissNotification = (capsuleId: string) => {
    setShowUnlockNotification(null);
    setDismissedNotifications((prev) => [...prev, capsuleId]);
  };
  const handleUnlockComplete = (capsuleId: string) => {
    unlockCapsule(capsuleId);
    setShowUnlockCeremony(null);
  };

  const notificationCapsule = showUnlockNotification
    ? capsules.find((c) => c.id === showUnlockNotification)
    : null;
  const ceremonyCapsule = showUnlockCeremony
    ? capsules.find((c) => c.id === showUnlockCeremony)
    : null;

  return (
    <LinearGradient
      colors={Theme.colors.cosmicGradient}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>
                {currentUser?.displayName || 'Future Traveler'}
              </Text>
            </View>
            <Sparkles size={32} color={Theme.colors.primary} />
          </View>
        </MotiView>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{sealedCount}</Text>
            <Text style={styles.statLabel}>Sealed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Theme.colors.primary }]}>
              {readyCount}
            </Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Theme.colors.success }]}>
              {openedCount}
            </Text>
            <Text style={styles.statLabel}>Opened</Text>
          </View>
        </MotiView>
        <View style={styles.listContainer}>
          {sortedCapsules.length === 0 ? (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 1000, delay: 400 }}
              style={styles.emptyState}
            >
              <Sparkles size={64} color={Theme.colors.primary} />
              <Text style={styles.emptyTitle}>Your vault awaits</Text>
              <Text style={styles.emptySubtitle}>
                Create your first time capsule and send a message to your future
                self
              </Text>
            </MotiView>
          ) : (
            <FlashList
              data={sortedCapsules}
              renderItem={({ item }) => (
                <CapsuleCard
                  capsule={item}
                  onPress={() => {
                    if (item.unlockDate <= Date.now() && !item.isUnlocked)
                      handleUnlockCapsule(item.id);
                  }}
                />
              )}
              keyExtractor={(item) => item.id}
              estimatedItemSize={120}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
        <MotiView
          from={{ scale: 0, rotate: '180deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          transition={{ type: 'spring', damping: 15, delay: 600 }}
          style={styles.fabContainer}
        >
          <Pressable onPress={handleCreateCapsule} style={styles.fab}>
            <LinearGradient
              colors={Theme.colors.accentGradient}
              style={styles.fabGradient}
            >
              <Plus
                size={28}
                color={Theme.colors.background}
                strokeWidth={2.5}
              />
            </LinearGradient>
          </Pressable>
        </MotiView>
      </SafeAreaView>
      {notificationCapsule && (
        <UnlockNotification
          capsule={notificationCapsule}
          onUnlock={() => handleUnlockCapsule(notificationCapsule.id)}
          onDismiss={() => handleDismissNotification(notificationCapsule.id)}
        />
      )}
      {ceremonyCapsule && (
        <UnlockCeremony
          capsule={ceremonyCapsule}
          onComplete={() => handleUnlockComplete(ceremonyCapsule.id)}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { padding: Theme.spacing.lg, paddingBottom: Theme.spacing.md },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  userName: {
    ...Theme.typography.h2,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
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
    marginTop: 2,
  },
  listContainer: { flex: 1 },
  listContent: { paddingBottom: 100, paddingTop: Theme.spacing.sm },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 24,
  },
  fabContainer: {
    position: 'absolute',
    right: Theme.spacing.lg,
    bottom: Theme.spacing.lg,
  },
  fab: { borderRadius: Theme.borderRadius.full, ...Theme.shadows.md },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
