import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Gift, Clock, ArrowRight } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { Capsule } from '@/types';

interface UnlockNotificationProps {
  capsule: Capsule;
  onUnlock: () => void;
  onDismiss: () => void;
}

export function UnlockNotification({ capsule, onUnlock, onDismiss }: UnlockNotificationProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.overlay}>
      <MotiView
        from={{ opacity: 0, scale: 0.8, translateY: 50 }}
        animate={{ opacity: 1, scale: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        style={styles.container}
      >
        <LinearGradient colors={Theme.colors.accentGradient} style={styles.gradient}>
          <View style={styles.content}>
            <MotiView
              from={{ rotate: '0deg' }}
              animate={{ rotate: '360deg' }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: true,
              }}
            >
              <Gift size={48} color={Theme.colors.background} />
            </MotiView>

            <Text style={styles.title}>Time Capsule Ready!</Text>
            <Text style={styles.capsuleTitle}>{capsule.title}</Text>
            
            <View style={styles.dateContainer}>
              <Clock size={16} color={Theme.colors.background} />
              <Text style={styles.dateText}>
                Sealed on {formatDate(capsule.createdAt)}
              </Text>
            </View>

            <View style={styles.actions}>
              <Pressable onPress={onDismiss} style={styles.dismissButton}>
                <Text style={styles.dismissText}>Later</Text>
              </Pressable>
              
              <Pressable onPress={onUnlock} style={styles.unlockButton}>
                <View style={styles.unlockButtonContent}>
                  <Text style={styles.unlockText}>Unlock Now</Text>
                  <ArrowRight size={20} color={Theme.colors.background} />
                </View>
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.lg,
    zIndex: 1000,
  },
  container: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 320,
  },
  gradient: {
    padding: Theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    ...Theme.typography.h2,
    color: Theme.colors.background,
    fontFamily: 'Inter-Bold',
    marginTop: Theme.spacing.lg,
    textAlign: 'center',
  },
  capsuleTitle: {
    ...Theme.typography.body,
    color: Theme.colors.background,
    fontFamily: 'Inter-SemiBold',
    marginTop: Theme.spacing.sm,
    textAlign: 'center',
    opacity: 0.9,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  dateText: {
    color: Theme.colors.background,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
  },
  actions: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    width: '100%',
  },
  dismissButton: {
    flex: 1,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background + '20',
    alignItems: 'center',
  },
  dismissText: {
    color: Theme.colors.background,
    fontFamily: 'Inter-SemiBold',
  },
  unlockButton: {
    flex: 2,
    backgroundColor: Theme.colors.background,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  unlockButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.md,
  },
  unlockText: {
    color: Theme.colors.primary,
    fontFamily: 'Inter-Bold',
  },
});
