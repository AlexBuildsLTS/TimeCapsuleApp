import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Plus, Sparkles } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useStore } from '@/store/useStore';
import { CapsuleCard } from '@/components/CapsuleCard';
import { UnlockNotification } from '@/components/UnlockNotification';
import { UnlockCeremony } from '@/components/UnlockCeremony';
import { Theme } from '@/constants/Theme';
import { useRouter } from 'expo-router';

export default function VaultScreen() {
  const { capsules, currentUser } = useStore();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showUnlockNotification, setShowUnlockNotification] = useState<string | null>(null);
  const [showUnlockCeremony, setShowUnlockCeremony] = useState<string | null>(null);

  let [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  // Update time every minute for countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Check for unlockable capsules
  useEffect(() => {
    const unlockableCapsule = capsules.find(c => 
      c.unlockDate <= currentTime && 
      !c.isUnlocked && 
      c.isSealed
    );
    
    if (unlockableCapsule && !showUnlockNotification && !showUnlockCeremony) {
      setShowUnlockNotification(unlockableCapsule.id);
    }
  }, [currentTime, capsules, showUnlockNotification, showUnlockCeremony]);
  if (!fontsLoaded) {
    return null;
  }

  const handleCreateCapsule = () => {
    router.push('/create');
  };

  const handleUnlockCapsule = (capsuleId: string) => {
    setShowUnlockNotification(null);
    setShowUnlockCeremony(capsuleId);
  };

  const handleUnlockComplete = (capsuleId: string) => {
    const { unlockCapsule } = useStore.getState();
    unlockCapsule(capsuleId);
    setShowUnlockCeremony(null);
  };
  const unlockableCapsules = capsules.filter(c => c.unlockDate <= currentTime && !c.isUnlocked);
  const sealedCapsules = capsules.filter(c => c.unlockDate > currentTime && c.isSealed);
  const unlockedCapsules = capsules.filter(c => c.isUnlocked);

  const notificationCapsule = showUnlockNotification ? 
    capsules.find(c => c.id === showUnlockNotification) : null;
  
  const ceremonyCapsule = showUnlockCeremony ? 
    capsules.find(c => c.id === showUnlockCeremony) : null;
  return (
    <LinearGradient colors={Theme.colors.cosmicGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{currentUser?.name}</Text>
            </View>
            <Sparkles size={32} color={Theme.colors.primary} />
          </View>
        </MotiView>

        {/* Stats Row */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 600, delay: 200 }}
          style={styles.statsContainer}
        >
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{sealedCapsules.length}</Text>
            <Text style={styles.statLabel}>Sealed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Theme.colors.primary }]}>{unlockableCapsules.length}</Text>
            <Text style={styles.statLabel}>Ready</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: Theme.colors.success }]}>{unlockedCapsules.length}</Text>
            <Text style={styles.statLabel}>Opened</Text>
          </View>
        </MotiView>

        {/* Capsules List */}
        <View style={styles.listContainer}>
          {capsules.length === 0 ? (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 1000, delay: 400 }}
              style={styles.emptyState}
            >
              <Sparkles size={64} color={Theme.colors.primary} />
              <Text style={styles.emptyTitle}>Your vault awaits</Text>
              <Text style={styles.emptySubtitle}>
                Create your first time capsule and send a message to your future self
              </Text>
            </MotiView>
          ) : (
            <FlashList
              data={capsules}
              renderItem={({ item }) => (
                <CapsuleCard
                  capsule={item}
                  onPress={() => {
                    const canUnlock = item.unlockDate <= currentTime && !item.isUnlocked;
                    if (canUnlock) {
                      handleUnlockCapsule(item.id);
                    } else if (item.isUnlocked) {
                      // TODO: Navigate to capsule detail view
                      console.log('View unlocked capsule:', item.title);
                    } else {
                      // Sealed capsule - show countdown
                      console.log('Capsule still sealed:', item.title);
                    }
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

        {/* Floating Action Button */}
        <MotiView
          from={{ scale: 0, rotate: '180deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          transition={{ type: 'spring', damping: 15, delay: 600 }}
          style={styles.fabContainer}
        >
          <Pressable onPress={handleCreateCapsule} style={styles.fab}>
            <LinearGradient colors={Theme.colors.accentGradient} style={styles.fabGradient}>
              <Plus size={28} color={Theme.colors.background} strokeWidth={2.5} />
            </LinearGradient>
          </Pressable>
        </MotiView>
      </SafeAreaView>

      {/* Unlock Notification */}
      {notificationCapsule && (
        <UnlockNotification
          capsule={notificationCapsule}
          onUnlock={() => handleUnlockCapsule(notificationCapsule.id)}
          onDismiss={() => setShowUnlockNotification(null)}
        />
      )}

      {/* Unlock Ceremony */}
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
  },
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
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: Theme.spacing.sm,
  },
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
    bottom: Theme.spacing.xl + 80, // Account for tab bar
  },
  fab: {
    borderRadius: Theme.borderRadius.full,
    ...Theme.shadows.md,
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: Theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});