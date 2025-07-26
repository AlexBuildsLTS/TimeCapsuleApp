import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Theme } from '@/constants/Theme';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface ParticleSystemProps {
  active: boolean;
  particleCount?: number;
}

export function ParticleSystem({ active, particleCount = 20 }: ParticleSystemProps) {
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Initialize particles
    particles.current = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 4 + 1,
      speed: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
    }));
  }, [particleCount]);

  if (!active) return null;

  return (
    <View style={styles.container}>
      {particles.current.map((particle) => (
        <MotiView
          key={particle.id}
          from={{
            translateX: particle.x,
            translateY: particle.y,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            translateX: particle.x + (Math.random() - 0.5) * 100,
            translateY: particle.y - 200,
            opacity: [0, particle.opacity, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            type: 'timing',
            duration: 3000,
            delay: Math.random() * 1000,
            loop: true,
          }}
          style={[
            styles.particle,
            {
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    backgroundColor: Theme.colors.primary,
  },
});