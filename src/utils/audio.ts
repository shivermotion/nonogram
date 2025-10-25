import { Audio } from 'expo-av';

let clickSound: Audio.Sound | null = null;
let tapSound: Audio.Sound | null = null;

export async function preloadAudio(): Promise<void> {
  try {
    if (!clickSound) {
      clickSound = new Audio.Sound();
      await clickSound.loadAsync(require('../../assets/kenney_ui-pack/Sounds/click-a.mp3'));
    }
    if (!tapSound) {
      tapSound = new Audio.Sound();
      await tapSound.loadAsync(require('../../assets/kenney_ui-pack/Sounds/tap-a.mp3'));
    }
  } catch (e) {
    // ignore audio preload failures
  }
}

export async function playClick(): Promise<void> {
  try {
    if (!clickSound) await preloadAudio();
    await clickSound?.replayAsync();
  } catch {}
}

export async function playTap(): Promise<void> {
  try {
    if (!tapSound) await preloadAudio();
    await tapSound?.replayAsync();
  } catch {}
}


