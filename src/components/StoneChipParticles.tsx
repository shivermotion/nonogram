import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import StoneChipParticle from './StoneChipParticle';

interface Particle {
  id: string;
  x: number;
  y: number;
  index: number;
}

export interface StoneChipParticlesRef {
  spawnParticles: (x: number, y: number) => void;
}

export const StoneChipParticles = forwardRef<StoneChipParticlesRef>((props, ref) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const spawnParticles = useCallback((x: number, y: number) => {
    console.log('spawnParticles called with:', { x, y });
    const particleCount = 6 + Math.floor(Math.random() * 4); // 6-9 particles
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        x: x + (Math.random() - 0.5) * 10, // Small random offset from touch point
        y: y + (Math.random() - 0.5) * 10,
        index: i,
      });
    }

    console.log('Spawning particles:', newParticles.length);
    setParticles(prev => {
      const updated = [...prev, ...newParticles];
      console.log('Total particles now:', updated.length);
      return updated;
    });
  }, []);

  const removeParticle = useCallback((id: string) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // Expose spawnParticles method via ref
  useImperativeHandle(ref, () => ({
    spawnParticles,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map(particle => (
        <StoneChipParticle
          key={particle.id}
          x={particle.x}
          y={particle.y}
          index={particle.index}
          onComplete={() => removeParticle(particle.id)}
        />
      ))}
    </View>
  );
});

StoneChipParticles.displayName = 'StoneChipParticles';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    pointerEvents: 'none',
    overflow: 'visible',
  },
});

export default StoneChipParticles;
