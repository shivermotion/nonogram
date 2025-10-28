import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  getOrCreateUserProfile,
  saveUserProfile,
  resetProgress,
  resetSettingsToDefaults,
} from '../utils/storage';
import DepthFog from '../components/DepthFog';
import LightRays from '../components/LightRays';
import GridBackground from '../components/GridBackground';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    (async () => {
      const profile = await getOrCreateUserProfile();
      setSoundEnabled(profile.preferences.soundEnabled);
      setVibrationEnabled(profile.preferences.vibrationEnabled);
      setShowTimer(profile.preferences.showTimer);
    })();
  }, []);

  const persist = async (
    next: Partial<{ soundEnabled: boolean; vibrationEnabled: boolean; showTimer: boolean }>
  ) => {
    const profile = await getOrCreateUserProfile();
    const updated = {
      ...profile,
      preferences: {
        ...profile.preferences,
        ...next,
      },
    };
    await saveUserProfile(updated);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'This will delete all your puzzle progress and statistics, but will keep your achievements and settings. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetProgress();
              Alert.alert('Success', 'Your progress has been reset!');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset progress. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'This will reset all settings to their default values:\n\n• Sound: ON\n• Vibration: ON\n• Show Timer: ON\n\nYour progress and achievements will be preserved. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetSettingsToDefaults();
              // Update local state to reflect the changes
              setSoundEnabled(true);
              setVibrationEnabled(true);
              setShowTimer(true);
              Alert.alert('Success', 'Settings have been reset to defaults!');
            } catch (error) {
              Alert.alert('Error', 'Failed to reset settings. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F9FF' }}>
      <DepthFog visible intensity={0.1} color="#2D1B3D" />
      <GridBackground spacing={64} thickness={6} color="#F8F9FF" />
      <LightRays visible rayCount={3} intensity={1} color="#F8F9FF" />

      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.list}>
          <View style={styles.row}>
            <Text style={styles.rowText}>Sound</Text>
            <Switch
              value={soundEnabled}
              onValueChange={async v => {
                setSoundEnabled(v);
                await persist({ soundEnabled: v });
              }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Vibration</Text>
            <Switch
              value={vibrationEnabled}
              onValueChange={async v => {
                setVibrationEnabled(v);
                await persist({ vibrationEnabled: v });
              }}
            />
          </View>

          <View style={styles.row}>
            <Text style={styles.rowText}>Show Timer</Text>
            <Switch
              value={showTimer}
              onValueChange={async v => {
                setShowTimer(v);
                await persist({ showTimer: v });
              }}
            />
          </View>

          <TouchableOpacity style={styles.resetSettingsButton} onPress={handleResetSettings}>
            <Ionicons name="settings-outline" size={20} color="#6c757d" />
            <Text style={styles.resetSettingsButtonText}>Reset Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={handleResetProgress}>
            <Ionicons name="refresh-outline" size={20} color="#dc3545" />
            <Text style={styles.resetButtonText}>Reset Progress</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerButton: { padding: 8 },
  title: { fontSize: 18, fontWeight: '700', color: '#333' },
  list: { padding: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  rowText: { fontSize: 16, color: '#333', fontWeight: '600' },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#dc3545',
  },
  resetSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#dc3545',
    fontWeight: '600',
    marginLeft: 8,
  },
  resetSettingsButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;
