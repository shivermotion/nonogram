import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

interface StoneChipParticleProps {
  x: number;
  y: number;
  index: number;
  onComplete: () => void;
}

const PARTICLE_COLORS = [
  '#6B6B6B', // Dark gray
  '#8B8B8B', // Medium gray
  '#A0A0A0', // Light gray
  '#5A5A5A', // Darker gray
  '#959595', // Gray
];

const PARTICLE_SIZES = [4, 5, 6, 7, 8];
const PARTICLE_DISTANCES = [60, 80, 100, 120, 140];
const PARTICLE_DURATIONS = [600, 700, 800, 900, 1000];

export const StoneChipParticle: React.FC<StoneChipParticleProps> = ({
  x,
  y,
  index,
  onComplete,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Random angle for chipping direction (mostly downward with some scatter)
    const angle = Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.6; // Between 90° ± 54°
    const distance = PARTICLE_DISTANCES[index % PARTICLE_DISTANCES.length];
    const duration = PARTICLE_DURATIONS[index % PARTICLE_DURATIONS.length];

    // Calculate final position
    const finalX = Math.cos(angle) * distance;
    const finalY = Math.sin(angle) * distance;

    // Animate the particle
    translateX.value = withTiming(finalX, {
      duration,
      easing: Easing.out(Easing.quad),
    });
    translateY.value = withTiming(finalY, {
      duration,
      easing: Easing.out(Easing.quad),
    });
    rotation.value = withTiming((Math.random() - 0.5) * 360, {
      duration,
      easing: Easing.linear,
    });
    opacity.value = withDelay(
      duration * 0.6,
      withTiming(0, {
        duration: duration * 0.4,
        easing: Easing.out(Easing.quad),
      })
    );
    scale.value = withTiming(0.5, {
      duration,
      easing: Easing.out(Easing.quad),
    });

    // Call onComplete when animation finishes
    setTimeout(() => {
      onComplete();
    }, duration);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  const color = PARTICLE_COLORS[index % PARTICLE_COLORS.length];
  const size = PARTICLE_SIZES[index % PARTICLE_SIZES.length];
  const borderRadius = size * 0.3; // Slightly rounded for stone-like appearance

  // Debug: log particle position
  useEffect(() => {
    console.log('Particle created at:', { x, y, color, size });
  }, [x, y, color, size]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius,
          backgroundColor: color,
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2,
          elevation: 3,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
});

export default StoneChipParticle;
