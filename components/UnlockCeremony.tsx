import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiText } from 'moti';
import { Sparkles, Gift, ArrowRight } from 'lucide-react-native';
import { Theme } from '@/constants/Theme';
import { Capsule } from '@/types';
import { ParticleSystem } from './ParticleSystem';

interface UnlockCeremonyProps {
  capsule: Capsule;
  onComplete: () => void;
}

export function UnlockCeremony({ capsule, onComplete }: UnlockCeremonyProps) {
  const [stage, setStage] = React.useState<'countdown' | 'unlock' | 'reveal'>('countdown');

  useEffect(() => {
    const timer1 = setTimeout(() => setStage('unlock'), 2000);
    const timer2 = setTimeout(() => setStage('reveal'), 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <LinearGradient colors={Theme.colors.cosmicGradient} style={styles.container}>
      <ParticleSystem active={stage === 'unlock'} />
      
      <View style={styles.content}>
        {stage === 'countdown' && (
          <MotiView
            from={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={styles.centerContent}
          >
            <MotiText
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.countdownText}
            >
              3... 2... 1...
            </MotiText>
          </MotiView>
        )}

        {stage === 'unlock' && (
          <MotiView
            from={{ scale: 0, rotate: '0deg' }}
            animate={{ scale: [0, 1.2, 1], rotate: ['0deg', '360deg', '0deg'] }}
            transition={{ type: 'timing', duration: 2000 }}
            style={styles.centerContent}
          >
            <Gift size={120} color={Theme.colors.primary} />
            <MotiText
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ delay: 1000 }}
              style={styles.unlockTitle}
            >
              Time Capsule Unlocked!
            </MotiText>
          </MotiView>
        )}

        {stage === 'reveal' && (
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.revealContent}
          >
            <View style={styles.capsulePreview}>
              <Text style={styles.capsuleTitle}>{capsule.title}</Text>
              {capsule.description && (
                <Text style={styles.capsuleDescription}>{capsule.description}</Text>
              )}
              
              <View style={styles.mediaCount}>
                <Sparkles size={16} color={Theme.colors.primary} />
                <Text style={styles.mediaCountText}>
                  {capsule.media.length} {capsule.media.length === 1 ? 'memory' : 'memories'} waiting
                </Text>
              </View>
            </View>

            <Pressable onPress={onComplete} style={styles.revealButton}>
              <LinearGradient colors={Theme.colors.accentGradient} style={styles.revealButtonGradient}>
                <Text style={styles.revealButtonText}>View Memories</Text>
                <ArrowRight size={20} color={Theme.colors.background} />
              </LinearGradient>
            </Pressable>
          </MotiView>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.xl,
  },
  centerContent: {
    alignItems: 'center',
  },
  countdownText: {
    ...Theme.typography.h1,
    color: Theme.colors.primary,
    fontFamily: 'Inter-Bold',
    fontSize: 48,
  },
  unlockTitle: {
    ...Theme.typography.h1,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginTop: Theme.spacing.xl,
  },
  revealContent: {
    width: '100%',
    alignItems: 'center',
  },
  capsulePreview: {
    backgroundColor: Theme.colors.surface + '80',
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    width: '100%',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
    borderWidth: 1,
    borderColor: Theme.colors.primary + '30',
  },
  capsuleTitle: {
    ...Theme.typography.h2,
    color: Theme.colors.onSurface,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  capsuleDescription: {
    ...Theme.typography.body,
    color: Theme.colors.onSurfaceVariant,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  mediaCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  mediaCountText: {
    ...Theme.typography.body,
    color: Theme.colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  revealButton: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    width: '100%',
  },
  revealButtonGradient: {
    padding: Theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Theme.spacing.sm,
  },
  revealButtonText: {
    ...Theme.typography.body,
    color: Theme.colors.background,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
});