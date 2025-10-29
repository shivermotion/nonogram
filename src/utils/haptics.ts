import * as Haptics from 'expo-haptics';
import { getOrCreateUserProfile } from './storage';

// Cache for vibration preference to avoid repeated async calls
let vibrationEnabledCache: boolean | null = null;
let lastCacheUpdate: number = 0;
const CACHE_DURATION = 5000; // 5 seconds

async function getVibrationEnabled(): Promise<boolean> {
  const now = Date.now();
  
  // Return cached value if still valid
  if (vibrationEnabledCache !== null && now - lastCacheUpdate < CACHE_DURATION) {
    return vibrationEnabledCache;
  }
  
  try {
    const profile = await getOrCreateUserProfile();
    vibrationEnabledCache = profile.preferences.vibrationEnabled;
    lastCacheUpdate = now;
    return vibrationEnabledCache;
  } catch (error) {
    console.error('Failed to load vibration preference:', error);
    // Default to enabled if we can't load preference
    return true;
  }
}

// Clear cache when preference changes
export function clearHapticCache() {
  vibrationEnabledCache = null;
  lastCacheUpdate = 0;
}

/**
 * Light haptic feedback for taps, button presses, etc.
 */
export async function hapticLight(): Promise<void> {
  const enabled = await getVibrationEnabled();
  if (!enabled) return;
  
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
}

/**
 * Medium haptic feedback for important actions
 */
export async function hapticMedium(): Promise<void> {
  const enabled = await getVibrationEnabled();
  if (!enabled) return;
  
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
}

/**
 * Heavy haptic feedback for significant events
 */
export async function hapticHeavy(): Promise<void> {
  const enabled = await getVibrationEnabled();
  if (!enabled) return;
  
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
}

/**
 * Selection haptic feedback for UI element selection
 */
export async function hapticSelection(): Promise<void> {
  const enabled = await getVibrationEnabled();
  if (!enabled) return;
  
  try {
    await Haptics.selectionAsync();
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
}

/**
 * Success haptic feedback for successful actions
 */
export async function hapticSuccess(): Promise<void> {
  const enabled = await getVibrationEnabled();
  if (!enabled) return;
  
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
}

/**
 * Warning haptic feedback for warnings
 */
export async function hapticWarning(): Promise<void> {
  const enabled = await getVibrationEnabled();
  if (!enabled) return;
  
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
}

/**
 * Error haptic feedback for errors
 */
export async function hapticError(): Promise<void> {
  const enabled = await getVibrationEnabled();
  if (!enabled) return;
  
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch (error) {
    // Silently fail on platforms that don't support haptics
  }
}

