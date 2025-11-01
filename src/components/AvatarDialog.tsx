import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

interface AvatarDialogProps {
  text: string;
  onNext?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  showSkip?: boolean;
  nextDisabled?: boolean;
  onBack?: () => void;
  backLabel?: string;
  backDisabled?: boolean;
  variant?: 'default' | 'intro';
}

const AvatarDialog: React.FC<AvatarDialogProps> = ({
  text,
  onNext,
  onSkip,
  nextLabel = 'Next',
  showSkip = false,
  nextDisabled = false,
  onBack,
  backLabel = 'Back',
  backDisabled = false,
  variant = 'default',
}) => {
  const isIntro = variant === 'intro';

  // Intro animations
  const avatarTx = useSharedValue(0);
  const avatarFloat = useSharedValue(0);
  const bubbleOpacity = useSharedValue(1);
  const bubbleTy = useSharedValue(0);

  useEffect(() => {
    if (isIntro) {
      // Reset to entrance state for each new intro message
      avatarTx.value = -80;
      bubbleOpacity.value = 0;
      bubbleTy.value = -8;
      // Enter animations
      avatarTx.value = withTiming(0, { duration: 480, easing: Easing.out(Easing.cubic) });
      bubbleOpacity.value = withTiming(1, { duration: 260, easing: Easing.out(Easing.quad) });
      bubbleTy.value = withTiming(0, { duration: 260, easing: Easing.out(Easing.quad) });
      // Gentle floating
      avatarFloat.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        true
      );
    }
  }, [isIntro, text]);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: isIntro ? avatarTx.value : 0 },
      { translateY: isIntro ? (avatarFloat.value - 0.5) * 4 : 0 },
    ],
  }));
  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: bubbleOpacity.value,
    transform: [{ translateY: bubbleTy.value }],
  }));

  const handleNextPress = () => {
    if (!onNext) return;
    if (isIntro) {
      avatarTx.value = withTiming(140, { duration: 260, easing: Easing.in(Easing.cubic) });
      bubbleOpacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.quad) });
      setTimeout(() => onNext(), 280);
    } else {
      onNext();
    }
  };
  return (
    <View
      style={{
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: isIntro ? undefined : 24,
        top: isIntro ? ('28%' as any) : undefined,
        flexDirection: isIntro ? 'column' : 'row',
        alignItems: 'flex-end',
        justifyContent: isIntro ? 'center' : 'flex-start',
      }}
    >
      {isIntro ? (
        <>
          <Animated.View
            style={[
              bubbleStyle,
              {
                maxWidth: 520,
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                paddingVertical: 16,
                paddingHorizontal: 18,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
                alignSelf: 'center',
                marginBottom: 12,
              },
            ]}
          >
            <Text
              style={{ color: '#333', fontSize: 14, lineHeight: 20, fontFamily: 'Kenney-Future' }}
            >
              {text}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
              {onBack && (
                <TouchableOpacity
                  onPress={backDisabled ? undefined : onBack}
                  disabled={backDisabled}
                  activeOpacity={0.7}
                  style={{
                    marginRight: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 6,
                    opacity: backDisabled ? 0.5 : 1,
                  }}
                >
                  <Text style={{ color: '#167DA8', fontSize: 12, fontFamily: 'Kenney-Future' }}>
                    {backLabel}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={nextDisabled ? undefined : handleNextPress}
                disabled={nextDisabled}
                activeOpacity={0.85}
              >
                <ImageBackground
                  source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/button_rectangle_depth_gradient.png')}
                  resizeMode="stretch"
                  style={{
                    height: 40,
                    minWidth: 120,
                    paddingHorizontal: 16,
                    justifyContent: 'center',
                    opacity: nextDisabled ? 0.6 : 1,
                  }}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 12,
                      fontFamily: 'Kenney-Future',
                      textAlign: 'center',
                    }}
                  >
                    {nextLabel}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View style={[avatarStyle, { width: 96, height: 96, alignSelf: 'center' }]}>
            <Image
              source={require('../../assets/images/statue.png')}
              style={{ width: '100%', height: '100%', borderRadius: 48 }}
            />
          </Animated.View>
        </>
      ) : (
        <>
          <View style={{ width: 64, height: 64, marginRight: 12 }}>
            <Image
              source={require('../../assets/images/statue.png')}
              style={{ width: '100%', height: '100%', borderRadius: 32 }}
            />
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              paddingVertical: 12,
              paddingHorizontal: 14,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text
              style={{ color: '#333', fontSize: 14, lineHeight: 20, fontFamily: 'Kenney-Future' }}
            >
              {text}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
              {onBack && (
                <TouchableOpacity
                  onPress={backDisabled ? undefined : onBack}
                  disabled={backDisabled}
                  activeOpacity={0.7}
                  style={{
                    marginRight: 10,
                    paddingHorizontal: 6,
                    paddingVertical: 6,
                    opacity: backDisabled ? 0.5 : 1,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                      source={require('../../assets/icons/arrow_left.png')}
                      style={{ width: 14, height: 14, marginRight: 6 }}
                    />
                    <Text style={{ color: '#167DA8', fontSize: 12, fontFamily: 'Kenney-Future' }}>
                      {backLabel}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={nextDisabled ? undefined : handleNextPress}
                disabled={nextDisabled}
                activeOpacity={0.85}
              >
                <ImageBackground
                  source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/button_rectangle_depth_gradient.png')}
                  resizeMode="stretch"
                  style={{
                    height: 40,
                    minWidth: 120,
                    paddingHorizontal: 16,
                    justifyContent: 'center',
                    opacity: nextDisabled ? 0.6 : 1,
                  }}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Image
                      source={require('../../assets/icons/next.png')}
                      style={{ width: 16, height: 16, marginRight: 6 }}
                    />
                    <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'Kenney-Future' }}>
                      {nextLabel}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default AvatarDialog;
