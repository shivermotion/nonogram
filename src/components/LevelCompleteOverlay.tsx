import React, { useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import AnimatedPuzzlePreview from './AnimatedPuzzlePreview';
import { hapticMedium, hapticLight } from '../utils/haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Icon Components using PNG assets
const ArrowRightIcon: React.FC<{ size: number }> = ({ size }) => (
  <Image
    source={require('../../assets/icons/arrow_right.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const RefreshIcon: React.FC<{ size: number }> = ({ size }) => (
  <Image
    source={require('../../assets/icons/undo.png')}
    style={{ width: size, height: size }}
    resizeMode="contain"
  />
);

const BlueButton: React.FC<{
  onPress: () => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  style?: any;
}> = ({ onPress, children, icon, style }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#167DA8',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#167DA8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 2,
        borderColor: '#1C9FD7',
      },
      style,
    ]}
  >
    {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
    {children}
  </TouchableOpacity>
);

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
      <Animated.Text
        style={[
          {
            fontSize: 24,
            fontWeight: '600',
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: 10,
            fontFamily: 'Kenney-Future',
            textShadowColor: 'rgba(0, 0, 0, 0.5)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2,
          },
          previewStyle,
        ]}
      >
        {puzzle.name}
      </Animated.Text>

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
        Complete!
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
            backgroundColor: 'rgba(54, 189, 247, 0.2)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            marginRight: 20,
            borderWidth: 1,
            borderColor: '#36BDF7',
          }}
        >
          <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../assets/icons/target.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#36BDF7',
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
            backgroundColor: 'rgba(54, 189, 247, 0.2)',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#36BDF7',
          }}
        >
          <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../../assets/icons/question_mark.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#36BDF7',
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
        <BlueButton
          onPress={() => {
            hapticMedium();
            onContinue();
          }}
          icon={<ArrowRightIcon size={20} />}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Kenney-Future',
            }}
          >
            Continue
          </Text>
        </BlueButton>

        <BlueButton
          onPress={() => {
            hapticLight();
            onReplay();
          }}
          icon={<RefreshIcon size={20} />}
          style={{
            backgroundColor: '#1C9FD7',
            borderColor: '#36BDF7',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF',
              fontFamily: 'Kenney-Future',
            }}
          >
            Replay
          </Text>
        </BlueButton>
      </Animated.View>
    </Animated.View>
  );
};

export default LevelCompleteOverlay;
