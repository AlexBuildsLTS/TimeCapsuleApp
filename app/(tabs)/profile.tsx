import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { User, Settings, Clock, Archive, Trophy, MapPin } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useStore } from '@/store/useStore';
import { Theme } from '@/constants/Theme';

export default function ProfileScreen() {
  const { currentUser, capsules } = useStore();
  
  let [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const totalCapsules = capsules.length;
  const unlockedCapsules = capsules.filter(c => c.isUnlocked).length;
  const sealedCapsules = capsules.filter(c => !c.isUnlocked).length;

  const achievements = [
    { icon: Archive, title: 'Time Keeper', description: 'Created your first capsule', unlocked: totalCapsules > 0 },
    { icon: Clock, title: 'Patient Soul', description: 'Waited 30 days for a capsule', unlocked: false },
    { icon: Trophy, title: 'Memory Master', description: 'Created 10 capsules', unlocked: totalCapsules >= 10 },
  ];

  return (
    <LinearGradient colors={Theme.colors.cosmicGradient} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.header}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient colors={Theme.colors.accentGradient} style={styles.avatar}>
                <User size={32} color={Theme.colors.background} />
              </LinearGradient>
            </View>
            <Text style={styles.userName}>{currentUser?.name}</Text>
            <Text style={styles.userEmail}>{currentUser?.email}</Text>
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
                <Text style={[styles.statNumber, { color: Theme.colors.success }]}>{unlockedCapsules}</Text>
                <Text style={styles.statLabel}>Unlocked</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: Theme.colors.primary }]}>{sealedCapsules}</Text>
                <Text style={styles.statLabel}>Sealed</Text>
              </View>
            </View>
          </MotiView>

          {/* Achievements */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400 }}
            style={styles.achievementsSection}
          >
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {achievements.map((achievement, index) => (
                <View key={index} style={[
                  styles.achievementCard,
                  { opacity: achievement.unlocked ? 1 : 0.5 }
                ]}>
                  <achievement.icon 
                    size={24} 
                    color={achievement.unlocked ? Theme.colors.primary : Theme.colors.onSurfaceVariant} 
                  />
                  <View style={styles.achievementContent}>
                    <Text style={[
                      styles.achievementTitle,
                      { color: achievement.unlocked ? Theme.colors.onSurface : Theme.colors.onSurfaceVariant }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.unlocked && (
                    <View style={styles.achievementBadge}>
                      <Text style={styles.achievementBadgeText}>✓</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </MotiView>

          {/* Settings */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600 }}
            style={styles.settingsSection}
          >
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsList}>
              <Pressable style={styles.settingItem}>
                <Settings size={20} color={Theme.colors.onSurfaceVariant} />
                <Text style={styles.settingText}>App Settings</Text>
              </Pressable>
              <Pressable style={styles.settingItem}>
                <MapPin size={20} color={Theme.colors.onSurfaceVariant} />
                <Text style={styles.settingText}>Location Settings</Text>
              </Pressable>
            </View>
          </MotiView>
        </ScrollView>
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
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  avatarContainer: {
    marginBottom: Theme.spacing.md,
  },
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
  statsSection: {
    marginBottom: Theme.spacing.xl,
  },
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
  achievementsSection: {
    marginBottom: Theme.spacing.xl,
  },
  achievementsList: {
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.md,
  },
  achievementCard: {
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    ...Theme.typography.body,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  achievementDescription: {
    ...Theme.typography.caption,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
  },
  achievementBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementBadgeText: {
    color: Theme.colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  settingsSection: {
    marginBottom: Theme.spacing.xl,
  },
  settingsList: {
    paddingHorizontal: Theme.spacing.lg,
    gap: Theme.spacing.sm,
  },
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