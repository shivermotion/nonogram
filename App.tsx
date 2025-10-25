import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NonogramPuzzle, UserProfile } from './src/types/game';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import TitleScreen from './src/screens/TitleScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import {
  getOrCreateUserProfile,
  updateStats,
  checkAndUnlockAchievements,
} from './src/utils/storage';

export default function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState<NonogramPuzzle | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showTitle, setShowTitle] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize user profile on app start
    const initializeProfile = async () => {
      try {
        const profile = await getOrCreateUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to initialize user profile:', error);
      }
    };

    initializeProfile();
  }, []);

  const handlePuzzleSelect = (puzzle: NonogramPuzzle) => {
    setCurrentPuzzle(puzzle);
  };

  const handleBackToMenu = () => {
    setCurrentPuzzle(null);
  };

  const handleGameComplete = async (puzzle: NonogramPuzzle, time: number, hintsUsed: number) => {
    try {
      // Update stats and check for achievements
      await updateStats(puzzle.id, puzzle.difficulty, puzzle.category, time, hintsUsed);
      const newAchievements = await checkAndUnlockAchievements(
        puzzle.id,
        puzzle.difficulty,
        puzzle.category,
        time,
        hintsUsed
      );

      // Refresh user profile
      const updatedProfile = await getOrCreateUserProfile();
      setUserProfile(updatedProfile);

      // Show achievement notifications
      if (newAchievements.length > 0) {
        const achievementNames = newAchievements.map(a => a.name).join(', ');
        Alert.alert('Achievement Unlocked!', `You earned: ${achievementNames}`, [
          { text: 'Awesome!', style: 'default' },
        ]);
      }

      console.log(`Completed ${puzzle.name} in ${time}ms with ${hintsUsed} hints`);

      // Return to menu after a short delay
      setTimeout(() => {
        setCurrentPuzzle(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to save game completion:', error);
      // Still return to menu even if saving fails
      setTimeout(() => {
        setCurrentPuzzle(null);
      }, 2000);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="dark" />
      {showTitle ? (
        <TitleScreen
          onStart={() => {
            setShowSettings(false);
            setShowTitle(false);
          }}
          onOpenSettings={() => {
            setShowTitle(false);
            setShowSettings(true);
          }}
        />
      ) : showSettings ? (
        <SettingsScreen
          onBack={() => {
            setShowSettings(false);
            setShowTitle(true);
          }}
        />
      ) : currentPuzzle ? (
        <GameScreen
          puzzle={currentPuzzle}
          onBack={handleBackToMenu}
          onComplete={handleGameComplete}
        />
      ) : (
        <MenuScreen onPuzzleSelect={puzzle => setCurrentPuzzle(puzzle)} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});
