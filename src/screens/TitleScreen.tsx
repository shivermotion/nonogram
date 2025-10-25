import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { Image } from 'react-native';
import { playClick } from '../utils/audio';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';

interface TitleScreenProps {
  onStart: () => void;
  onOpenSettings: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onOpenSettings }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Image
            source={require('../../assets/icons/tile042.png')}
            style={{ width: 64, height: 64 }}
          />
          <Text style={styles.title}>Nonogram</Text>
          <Text style={styles.subtitle}>Logic Puzzles</Text>

          <TouchableOpacity
            onPress={async () => {
              await playClick();
              onStart();
            }}
            activeOpacity={0.85}
            style={{ alignSelf: 'stretch' }}
          >
            <ImageBackground
              source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/button_rectangle_depth_gradient.png')}
              resizeMode="stretch"
              style={[styles.buttonBg]}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={require('../../assets/icons/button_a.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={[styles.buttonText, styles.primaryText]}>Play</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await playClick();
              onOpenSettings();
            }}
            activeOpacity={0.85}
            style={{ alignSelf: 'stretch' }}
          >
            <ImageBackground
              source={require('../../assets/kenney_ui-pack/PNG/Blue/Default/button_rectangle_flat.png')}
              resizeMode="stretch"
              style={styles.buttonBg}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.buttonContent}>
                <Image
                  source={require('../../assets/icons/settings.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.buttonText}>Settings</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#333',
    marginTop: 12,
    fontFamily: 'Kenney-Future',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 6,
    marginBottom: 24,
    fontFamily: 'Kenney-Future',
  },
  buttonBg: {
    height: 56,
    marginTop: 12,
    alignSelf: 'stretch',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    fontFamily: 'Kenney-Future',
  },
  primaryText: { color: '#fff' },
});

export default TitleScreen;
