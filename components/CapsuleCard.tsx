import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, MapPin } from 'lucide-react-native';
import { Capsule } from '@/types';
import { Theme } from '@/constants/Theme';

interface CapsuleCardProps {
  capsule: Capsule;
  onPress?: () => void;
}

export function CapsuleCard({ capsule, onPress }: CapsuleCardProps) {
  const timeRemaining = capsule.unlockDate - Date.now();
  const isUnlockable = timeRemaining <= 0 && !capsule.isUnlocked;
  const isUnlocked = capsule.isUnlocked;
  
  const formatTimeRemaining = (ms: number): string => {
    if (ms <= 0) return 'Ready to unlock!';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <MotiView
      from={{ opacity: 0.8, scale: 1 }}
      animate={{ opacity: 1, scale: 1.02 }}
      transition={{
        type: 'timing',
        duration: 3000,
        loop: true,
      }}
    >
      <Pressable onPress={onPress} style={styles.container}>
        <LinearGradient
          colors={isUnlockable ? Theme.colors.accentGradient : [Theme.colors.surface, Theme.colors.surfaceVariant]}
          style={styles.gradient}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: isUnlockable ? Theme.colors.background : Theme.colors.onSurface }]}>
                {capsule.title}
              </Text>
              <View style={styles.statusBadge}>
                <View style={[
                  styles.statusIndicator,
                  { backgroundColor: isUnlocked ? Theme.colors.success : isUnlockable ? Theme.colors.primary : Theme.colors.warning }
                ]} />
              </View>
            </View>
            
            {capsule.description && (
              <Text style={[styles.description, { color: isUnlockable ? Theme.colors.background : Theme.colors.onSurfaceVariant }]}>
                {capsule.description}
              </Text>
            )}
            
            <View style={styles.footer}>
              <View style={styles.timeContainer}>
                <Clock size={16} color={isUnlockable ? Theme.colors.background : Theme.colors.primary} />
                <Text style={[styles.timeText, { color: isUnlockable ? Theme.colors.background : Theme.colors.primary }]}>
                  {isUnlocked ? 'Unlocked' : formatTimeRemaining(timeRemaining)}
                </Text>
              </View>
              
              {capsule.location && (
                <View style={styles.locationContainer}>
                  <MapPin size={16} color={isUnlockable ? Theme.colors.background : Theme.colors.onSurfaceVariant} />
                  <Text style={[styles.locationText, { color: isUnlockable ? Theme.colors.background : Theme.colors.onSurfaceVariant }]}>
                    {capsule.location.address || 'Unknown location'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '20',
  },
  content: {
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  title: {
    ...Theme.typography.h3,
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  statusBadge: {
    padding: Theme.spacing.xs,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  description: {
    ...Theme.typography.body,
    marginBottom: Theme.spacing.md,
    opacity: 0.8,
  },
  footer: {
    gap: Theme.spacing.sm,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  timeText: {
    ...Theme.typography.caption,
    fontWeight: '600',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
  },
  locationText: {
    ...Theme.typography.caption,
  },
});