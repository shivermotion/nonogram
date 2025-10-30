import { Audio } from 'expo-av';

let clickSound: Audio.Sound | null = null; // generic UI click
let tapSound: Audio.Sound | null = null; // generic UI tap
let completionSound: Audio.Sound | null = null; // small completion chime
let levelCompleteMusic: Audio.Sound | null = null; // level complete music

let fillSound: Audio.Sound | null = null; // cell filled
let markSound: Audio.Sound | null = null; // cell marked (X)
let autoMarkLineSound: Audio.Sound | null = null; // line auto-marked

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
    if (!completionSound) {
      completionSound = new Audio.Sound();
      await completionSound.loadAsync(require('../../assets/kenney_ui-pack/Sounds/click-b.mp3'));
    }
    if (!levelCompleteMusic) {
      levelCompleteMusic = new Audio.Sound();
      await levelCompleteMusic.loadAsync(require('../../assets/kenney_ui-pack/Sounds/switch-a.mp3'));
    }
    if (!fillSound) {
      fillSound = new Audio.Sound();
      await fillSound.loadAsync(require('../../assets/kenney_ui-pack/Sounds/tap-b.mp3'));
    }
    if (!markSound) {
      markSound = new Audio.Sound();
      await markSound.loadAsync(require('../../assets/kenney_ui-pack/Sounds/click-b.mp3'));
    }
    if (!autoMarkLineSound) {
      autoMarkLineSound = new Audio.Sound();
      await autoMarkLineSound.loadAsync(require('../../assets/kenney_ui-pack/Sounds/switch-b.mp3'));
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

export async function playCompletion(): Promise<void> {
  try {
    if (!completionSound) await preloadAudio();
    await completionSound?.replayAsync();
  } catch {}
}

export async function playLevelCompleteMusic(): Promise<void> {
  try {
    if (!levelCompleteMusic) await preloadAudio();
    await levelCompleteMusic?.replayAsync();
  } catch {}
}

export async function playFill(): Promise<void> {
  try {
    if (!fillSound) await preloadAudio();
    await fillSound?.replayAsync();
  } catch {}
}

export async function playMark(): Promise<void> {
  try {
    if (!markSound) await preloadAudio();
    await markSound?.replayAsync();
  } catch {}
}

export async function playAutoMarkLine(): Promise<void> {
  try {
    if (!autoMarkLineSound) await preloadAudio();
    await autoMarkLineSound?.replayAsync();
  } catch {}
}
