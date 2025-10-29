import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface AnimatedPuzzlePreviewProps {
  solution: boolean[][];
  width: number;
  height: number;
  visible: boolean;
}

export const AnimatedPuzzlePreview: React.FC<AnimatedPuzzlePreviewProps> = ({
  solution,
  width,
  height,
  visible,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (visible) {
      // Animate in with delay
      scale.value = withDelay(
        1000, // Wait for border lighting to start
        withSequence(
          withTiming(0.8, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
          withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) })
        )
      );

      opacity.value = withDelay(
        1000,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
      );

      translateY.value = withDelay(
        1000,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.2)) })
      );
    } else {
      scale.value = withTiming(0, { duration: 200 });
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(50, { duration: 200 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const rows = solution.length;
  const cols = solution[0]?.length ?? 0;
  const cellSize = Math.max(2, Math.floor(Math.min(width / cols, height / rows)));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderWidth: 2,
          borderColor: '#FFD700',
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#fff',
          shadowColor: '#FFD700',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        animatedStyle,
      ]}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {solution.map((row, rIdx) => (
          <View key={rIdx} style={{ flexDirection: 'row', height: cellSize }}>
            {row.map((filled, cIdx) => (
              <View
                key={cIdx}
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: filled ? '#333' : '#fff',
                  borderWidth: 0.5,
                  borderColor: '#e0e0e0',
                }}
              />
            ))}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

export default AnimatedPuzzlePreview;
