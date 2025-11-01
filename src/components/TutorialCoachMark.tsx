import React from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface TutorialCoachMarkProps {
  message: string;
  visible: boolean;
  topOffset?: number;
}

const TutorialCoachMark: React.FC<TutorialCoachMarkProps> = ({
  message,
  visible,
  topOffset = 12,
}) => {
  const pulse = useSharedValue(0.5);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1200 }), -1, true);
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: pulse.value }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        style,
        {
          position: 'absolute',
          top: topOffset,
          left: 12,
          right: 12,
          padding: 10,
          backgroundColor: 'rgba(28, 159, 215, 0.15)',
          borderWidth: 1,
          borderColor: '#1C9FD7',
          borderRadius: 10,
        },
      ]}
    >
      <Text style={{ color: '#167DA8', fontSize: 12, fontFamily: 'Kenney-Future' }}>{message}</Text>
    </Animated.View>
  );
};

export default TutorialCoachMark;
