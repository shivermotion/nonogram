import React, { useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import AnimatedPuzzlePreview from './AnimatedPuzzlePreview';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface LevelCompleteOverlayProps {
  puzzle: any;
  visible: boolean;
  completedTime: number;
  completedHints: number;
  onContinue: () => void;
  onReplay: () => void;
  onAnimationComplete?: () => void;
}

export const LevelCompleteOverlay: React.FC<LevelCompleteOverlayProps> = ({
  puzzle,
  visible,
  completedTime,
  completedHints,
  onContinue,
  onReplay,
  onAnimationComplete,
}) => {
  const overlayOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleScale = useSharedValue(0.5);
  const titleTranslateY = useSharedValue(30);
  const previewOpacity = useSharedValue(0);
  const previewScale = useSharedValue(0);
  const statsOpacity = useSharedValue(0);
  const statsTranslateY = useSharedValue(30);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(30);

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (visible) {
      // Start overlay fade in
      overlayOpacity.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.quad),
      });

      // Animate title with delay
      titleOpacity.value = withDelay(
        1200,
        withTiming(1, { duration: 600, easing: Easing.out(Easing.quad) })
      );

      titleScale.value = withDelay(
        1200,
        withSequence(
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
          withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) })
        )
      );

      titleTranslateY.value = withDelay(
        1200,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.2)) })
      );

      // Animate preview
      previewOpacity.value = withDelay(
        1800,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
      );

      previewScale.value = withDelay(
        1800,
        withSequence(
          withTiming(1.05, { duration: 300, easing: Easing.out(Easing.back(1.5)) }),
          withTiming(1, { duration: 200, easing: Easing.out(Easing.quad) })
        )
      );

      // Animate stats
      statsOpacity.value = withDelay(
        2400,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
      );

      statsTranslateY.value = withDelay(
        2400,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.2)) })
      );

      // Animate buttons
      buttonsOpacity.value = withDelay(
        3000,
        withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
      );

      buttonsTranslateY.value = withDelay(
        3000,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.2)) })
      );

      // Call completion callback after animations
      setTimeout(() => {
        onAnimationComplete?.();
      }, 4000);
    } else {
      overlayOpacity.value = withTiming(0, { duration: 300 });
      titleOpacity.value = withTiming(0, { duration: 200 });
      titleScale.value = withTiming(0.5, { duration: 200 });
      titleTranslateY.value = withTiming(30, { duration: 200 });
      previewOpacity.value = withTiming(0, { duration: 200 });
      previewScale.value = withTiming(0, { duration: 200 });
      statsOpacity.value = withTiming(0, { duration: 200 });
      statsTranslateY.value = withTiming(30, { duration: 200 });
      buttonsOpacity.value = withTiming(0, { duration: 200 });
      buttonsTranslateY.value = withTiming(30, { duration: 200 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ scale: titleScale.value }, { translateY: titleTranslateY.value }],
  }));

  const previewStyle = useAnimatedStyle(() => ({
    opacity: previewOpacity.value,
    transform: [{ scale: previewScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [{ translateY: statsTranslateY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        },
        overlayStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          previewStyle,
        ]}
      >
        <AnimatedPuzzlePreview
          solution={puzzle.solution}
          width={120}
          height={120}
          visible={visible}
        />
      </Animated.View>

      <Animated.Text
        style={[
          {
            fontSize: 48,
            fontWeight: 'bold',
            color: '#FFD700',
            textAlign: 'center',
            marginTop: 20,
            fontFamily: 'Kenney-Future',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 2, height: 2 },
            textShadowRadius: 4,
          },
          titleStyle,
        ]}
      >
        Level Complete!
      </Animated.Text>

      <Animated.Text
        style={[
          {
            fontSize: 24,
            fontWeight: '600',
            color: '#fff',
            textAlign: 'center',
            marginTop: 10,
            fontFamily: 'Kenney-Future',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          },
          titleStyle,
        ]}
      >
        {puzzle.name}
      </Animated.Text>

      {/* Stats */}
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 30,
            paddingHorizontal: 40,
          },
          statsStyle,
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 30,
          }}
        >
          <Ionicons name="time-outline" size={24} color="#FFD700" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#fff',
              marginLeft: 8,
              fontFamily: 'Kenney-Future',
            }}
          >
            {formatTime(completedTime)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="bulb-outline" size={24} color="#FFD700" />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#fff',
              marginLeft: 8,
              fontFamily: 'Kenney-Future',
            }}
          >
            {completedHints} hints
          </Text>
        </View>
      </Animated.View>

      {/* Action Buttons */}
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
            gap: 20,
          },
          buttonsStyle,
        ]}
      >
        <TouchableOpacity
          onPress={onContinue}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#007AFF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="chevron-forward-outline" size={20} color="#fff" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff',
              marginLeft: 8,
              fontFamily: 'Kenney-Future',
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onReplay}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FF3B30',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
            shadowColor: '#FF3B30',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="refresh-outline" size={20} color="#fff" />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#fff',
              marginLeft: 8,
              fontFamily: 'Kenney-Future',
            }}
          >
            Replay
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default LevelCompleteOverlay;
