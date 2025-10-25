import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
          <Ionicons name="grid-outline" size={64} color="#007AFF" />
          <Text style={styles.title}>Nonogram</Text>
          <Text style={styles.subtitle}>Logic Puzzles</Text>

          <TouchableOpacity style={[styles.button, styles.primary]} onPress={onStart}>
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={[styles.buttonText, styles.primaryText]}>Play</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={onOpenSettings}>
            <Ionicons name="settings-outline" size={20} color="#007AFF" />
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 36, fontWeight: '800', color: '#333', marginTop: 12 },
  subtitle: { fontSize: 16, color: '#666', marginTop: 6, marginBottom: 24 },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8 as any,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#e9ecef',
    marginTop: 12,
  },
  buttonText: { marginLeft: 8, fontSize: 16, fontWeight: '600', color: '#007AFF' },
  primary: { backgroundColor: '#007AFF' },
  primaryText: { color: '#fff' },
});

export default TitleScreen;
