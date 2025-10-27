import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { playClick } from '../utils/audio';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';

interface TitleScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenSettings }) => {
  // Sophisticated animation values for high art aesthetic
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(-5);
  const translateY = useSharedValue(50);
  const shadowOpacity = useSharedValue(0);
  const borderGlow = useSharedValue(0);

  // Text animations
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(20);

  // Button animations
  const button1Opacity = useSharedValue(0);
  const button1TranslateY = useSharedValue(40);
  const button2Opacity = useSharedValue(0);
  const button2TranslateY = useSharedValue(40);

  useEffect(() => {
    // Elegant entrance animation with sophisticated timing
    scale.value = withTiming(1, {
      duration: 2000,
      easing: Easing.out(Easing.cubic),
    });

    opacity.value = withTiming(1, {
      duration: 1800,
      easing: Easing.out(Easing.quad),
    });

    rotation.value = withTiming(0, {
      duration: 2500,
      easing: Easing.out(Easing.back(1.2)),
    });

    translateY.value = withTiming(0, {
      duration: 2200,
      easing: Easing.out(Easing.cubic),
    });

    shadowOpacity.value = withTiming(0.3, {
      duration: 3000,
      easing: Easing.out(Easing.quad),
    });

    // Continuous subtle breathing animation
    borderGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );

    // Staggered text animations for elegant reveal
    titleOpacity.value = withTiming(1, {
      duration: 1500,
      easing: Easing.out(Easing.quad),
    });
    titleTranslateY.value = withTiming(0, {
      duration: 1800,
      easing: Easing.out(Easing.cubic),
    });

    subtitleOpacity.value = withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.quad),
    });
    subtitleTranslateY.value = withTiming(0, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });

    // Button entrance animations with sophisticated delays
    button1Opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });
    button1TranslateY.value = withTiming(0, {
      duration: 1200,
      easing: Easing.out(Easing.back(1.1)),
    });

    button2Opacity.value = withTiming(1, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });
    button2TranslateY.value = withTiming(0, {
      duration: 1200,
      easing: Easing.out(Easing.back(1.1)),
    });
  }, []);

  const animatedVideoStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
      shadowColor: '#2D1B3D',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: shadowOpacity.value,
      shadowRadius: 20,
      elevation: 20,
    };
  });

  const animatedTitleStyle = useAnimatedStyle(() => {
    return {
      opacity: titleOpacity.value,
      transform: [{ translateY: titleTranslateY.value }],
    };
  });

  const animatedSubtitleStyle = useAnimatedStyle(() => {
    return {
      opacity: subtitleOpacity.value,
      transform: [{ translateY: subtitleTranslateY.value }],
    };
  });

  const animatedButton1Style = useAnimatedStyle(() => {
    return {
      opacity: button1Opacity.value,
      transform: [{ translateY: button1TranslateY.value }],
    };
  });

  const animatedButton2Style = useAnimatedStyle(() => {
    return {
      opacity: button2Opacity.value,
      transform: [{ translateY: button2TranslateY.value }],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView
        style={{ flex: 1, backgroundColor: 'transparent' }}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Animated.View style={animatedVideoStyle}>
            <Video
              source={require('../../assets/video/social_shamtaro_a_grid_with_the_cells_being_filled_in_to_create_a_be_1f322b2f-cf26-4a1c-b9ed-c0f93ee11216_3.mp4')}
              style={{ width: 500, height: 500, borderRadius: 18 }}
              shouldPlay
              isLooping
              resizeMode={ResizeMode.CONTAIN}
            />
          </Animated.View>
          <Animated.Text
            style={[
              {
                fontSize: 36,
                fontWeight: '800',
                color: '#333',
                marginTop: 12,
                fontFamily: 'Kenney-Future',
              },
              animatedTitleStyle,
            ]}
          >
            Nonogram
          </Animated.Text>
          <Animated.Text
            style={[
              {
                fontSize: 16,
                color: '#666',
                marginTop: 6,
                marginBottom: 24,
                fontFamily: 'Kenney-Future',
              },
              animatedSubtitleStyle,
            ]}
          >
            Logic Puzzles
          </Animated.Text>

          <Animated.View style={animatedButton1Style}>
            <TouchableOpacity
              onPress={async () => {
                await playClick();
                onStart();
              }}
              activeOpacity={0.85}
              style={{ alignSelf: 'center' }}
            >
              <ImageBackground
                source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/button_rectangle_depth_gradient.png')}
                resizeMode="stretch"
                style={{
                  height: 56,
                  width: 200,
                  marginTop: 12,
                }}
                imageStyle={{ borderRadius: 10 }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    gap: 8,
                  }}
                >
                  <Image
                    source={require('../../assets/icons/button_a.png')}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#fff',
                      fontFamily: 'Kenney-Future',
                    }}
                  >
                    Play
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={animatedButton2Style}>
            <TouchableOpacity
              onPress={async () => {
                await playClick();
                onOpenSettings();
              }}
              activeOpacity={0.85}
              style={{ alignSelf: 'center' }}
            >
              <ImageBackground
                source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/button_rectangle_depth_gradient.png')}
                resizeMode="stretch"
                style={{
                  height: 56,
                  width: 200,
                  marginTop: 12,
                }}
                imageStyle={{ borderRadius: 10 }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    gap: 8,
                  }}
                >
                  <Image
                    source={require('../../assets/icons/settings.png')}
                    style={{ width: 20, height: 20 }}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#fff',
                      fontFamily: 'Kenney-Future',
                    }}
                  >
                    Settings
                  </Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default TitleScreen;
