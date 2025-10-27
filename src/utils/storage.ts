import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSession, GameStats, UserProfile, Achievement, Difficulty, Category } from '../types/game';

const STORAGE_KEYS = {
  GAME_SESSION: 'nonogram_game_session',
  USER_PROFILE: 'nonogram_user_profile',
  COMPLETED_PUZZLES: 'nonogram_completed_puzzles',
  ACHIEVEMENTS: 'nonogram_achievements',
};

// Game Session Management
export async function saveGameSession(session: GameSession): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save game session:', error);
  }
}

export async function loadGameSession(): Promise<GameSession | null> {
  try {
    const sessionData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_SESSION);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Failed to load game session:', error);
    return null;
  }
}

export async function clearGameSession(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.GAME_SESSION);
  } catch (error) {
    console.error('Failed to clear game session:', error);
  }
}

// User Profile Management
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Failed to save user profile:', error);
  }
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const profileData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return profileData ? JSON.parse(profileData) : null;
  } catch (error) {
    console.error('Failed to load user profile:', error);
    return null;
  }
}

export async function getOrCreateUserProfile(): Promise<UserProfile> {
  let profile = await loadUserProfile();
  
  if (!profile) {
    profile = createDefaultProfile();
    await saveUserProfile(profile);
  }
  
  return profile;
}

function createDefaultProfile(): UserProfile {
  return {
    id: `user_${Date.now()}`,
    stats: {
      puzzlesCompleted: 0,
      totalPlayTime: 0,
      hintsUsed: 0,
      averageCompletionTime: 0,
      bestTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      completedByDifficulty: {
        [Difficulty.EASY]: 0,
        [Difficulty.MEDIUM]: 0,
        [Difficulty.HARD]: 0,
        [Difficulty.EXPERT]: 0,
      },
      completedByCategory: {
        [Category.ANIMALS]: 0,
        [Category.OBJECTS]: 0,
        [Category.NATURE]: 0,
        [Category.FOOD]: 0,
        [Category.VEHICLES]: 0,
        [Category.ABSTRACT]: 0,
        [Category.EDUCATIONAL]: 0,
      },
    },
    achievements: [],
    preferences: {
      theme: 'light',
      soundEnabled: true,
      vibrationEnabled: true,
      showTimer: true,
      autoMarkObvious: false,
    },
  };
}

// Completed Puzzles Tracking
export async function saveCompletedPuzzle(
  puzzleId: string, 
  completionTime: number, 
  hintsUsed: number
): Promise<void> {
  try {
    const completedData = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_PUZZLES);
    const completed = completedData ? JSON.parse(completedData) : {};
    
    completed[puzzleId] = {
      completionTime,
      hintsUsed,
      completedAt: Date.now(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.COMPLETED_PUZZLES, JSON.stringify(completed));
  } catch (error) {
    console.error('Failed to save completed puzzle:', error);
  }
}

export async function getCompletedPuzzles(): Promise<Record<string, any>> {
  try {
    const completedData = await AsyncStorage.getItem(STORAGE_KEYS.COMPLETED_PUZZLES);
    return completedData ? JSON.parse(completedData) : {};
  } catch (error) {
    console.error('Failed to load completed puzzles:', error);
    return {};
  }
}

export async function isPuzzleCompleted(puzzleId: string): Promise<boolean> {
  const completed = await getCompletedPuzzles();
  return !!completed[puzzleId];
}

// Statistics Updates
export async function updateStats(
  puzzleId: string,
  difficulty: Difficulty,
  category: Category,
  completionTime: number,
  hintsUsed: number
): Promise<void> {
  try {
    const profile = await getOrCreateUserProfile();
    
    // Update basic stats
    profile.stats.puzzlesCompleted++;
    profile.stats.totalPlayTime += completionTime;
    profile.stats.hintsUsed += hintsUsed;
    profile.stats.averageCompletionTime = 
      profile.stats.totalPlayTime / profile.stats.puzzlesCompleted;
    
    // Update best time
    if (profile.stats.bestTime === 0 || completionTime < profile.stats.bestTime) {
      profile.stats.bestTime = completionTime;
    }
    
    // Update streak
    profile.stats.currentStreak++;
    if (profile.stats.currentStreak > profile.stats.longestStreak) {
      profile.stats.longestStreak = profile.stats.currentStreak;
    }
    
    // Update difficulty stats
    profile.stats.completedByDifficulty[difficulty]++;
    
    // Update category stats
    profile.stats.completedByCategory[category]++;
    
    await saveUserProfile(profile);
    await saveCompletedPuzzle(puzzleId, completionTime, hintsUsed);
  } catch (error) {
    console.error('Failed to update stats:', error);
  }
}

// Achievements
const ACHIEVEMENT_DEFINITIONS: Achievement[] = [
  {
    id: 'first_puzzle',
    name: 'First Steps',
    description: 'Complete your first puzzle',
    icon: 'trophy-outline',
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete a puzzle in under 2 minutes',
    icon: 'flash-outline',
  },
  {
    id: 'no_hints',
    name: 'Pure Logic',
    description: 'Complete a puzzle without using hints',
    icon: 'brain-outline',
  },
  {
    id: 'ten_puzzles',
    name: 'Dedicated Solver',
    description: 'Complete 10 puzzles',
    icon: 'star-outline',
  },
  {
    id: 'all_difficulties',
    name: 'Well Rounded',
    description: 'Complete puzzles of all difficulty levels',
    icon: 'medal-outline',
  },
];

export async function checkAndUnlockAchievements(
  puzzleId: string,
  difficulty: Difficulty,
  category: Category,
  completionTime: number,
  hintsUsed: number
): Promise<Achievement[]> {
  try {
    const profile = await getOrCreateUserProfile();
    const newAchievements: Achievement[] = [];
    
    for (const achievement of ACHIEVEMENT_DEFINITIONS) {
      // Skip if already unlocked
      if (profile.achievements.some(a => a.id === achievement.id)) {
        continue;
      }
      
      let shouldUnlock = false;
      
      switch (achievement.id) {
        case 'first_puzzle':
          shouldUnlock = profile.stats.puzzlesCompleted >= 1;
          break;
        case 'speed_demon':
          shouldUnlock = completionTime < 120000; // 2 minutes
          break;
        case 'no_hints':
          shouldUnlock = hintsUsed === 0;
          break;
        case 'ten_puzzles':
          shouldUnlock = profile.stats.puzzlesCompleted >= 10;
          break;
        case 'all_difficulties':
          shouldUnlock = Object.values(profile.stats.completedByDifficulty)
            .every(count => count > 0);
          break;
      }
      
      if (shouldUnlock) {
        const unlockedAchievement: Achievement = {
          ...achievement,
          unlockedAt: Date.now(),
        };
        profile.achievements.push(unlockedAchievement);
        newAchievements.push(unlockedAchievement);
      }
    }
    
    if (newAchievements.length > 0) {
      await saveUserProfile(profile);
    }
    
    return newAchievements;
  } catch (error) {
    console.error('Failed to check achievements:', error);
    return [];
  }
}

// Reset all data (useful for development/testing)
export async function resetAllData(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    console.log('All game data has been reset');
  } catch (error) {
    console.error('Failed to reset data:', error);
  }
}
