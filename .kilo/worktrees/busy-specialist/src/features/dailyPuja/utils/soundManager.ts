import Sound from 'react-native-sound';
import {Platform} from 'react-native';

// Enable playback in silence mode on iOS
Sound.setCategory('Playback');

// Sound file mapping - using exact filenames without extension
const SOUND_FILES = {
  aarti: 'aarti',
  bell: 'bell',
  shankh: 'shankh',
};

// Sound objects storage
const soundObjectsRef: {[key: string]: Sound} = {};

// Track playing status
const isPlayingStatus: {[key: string]: boolean} = {};

// Track initialization
let isAudioInitialized = false;

/**
 * Initialize audio session
 */
const initAudio = (): void => {
  if (isAudioInitialized) {
    return;
  }

  if (Platform.OS === 'ios') {
    Sound.setCategory('Playback');
    console.log('[SoundManager] Audio session configured for iOS');
  } else {
    // For Android, also set category
    Sound.setCategory('Playback');
    console.log('[SoundManager] Audio initialized for Android');
  }

  isAudioInitialized = true;
};

// Initialize on module load
initAudio();

/**
 * Load sound - handles both iOS and Android properly
 */
const loadSound = (soundName: string): Promise<Sound> => {
  return new Promise((resolve, reject) => {
    const soundFile = SOUND_FILES[soundName as keyof typeof SOUND_FILES];

    if (!soundFile) {
      reject(new Error(`Unknown sound: ${soundName}`));
      return;
    }

    console.log(`[SoundManager] Loading sound: ${soundFile} for ${soundName}`);

    // For Android, we should NOT specify basePath for sounds in res/raw
    // react-native-sound automatically looks in res/raw when basePath is null/undefined
    // For iOS, we use the main bundle directory
    const basePath = Platform.OS === 'ios' ? Sound.MAIN_BUNDLE : undefined;

    const sound = new Sound(soundFile, basePath, error => {
      if (error) {
        console.error(`[SoundManager] Failed to load: ${soundFile}`, error);
        reject(error);
        return;
      }

      console.log(`[SoundManager] Sound loaded successfully: ${soundName}`);
      soundObjectsRef[soundName] = sound;
      resolve(sound);
    });
  });
};

/**
 * Play sound with proper error handling
 */
const playSound = (
  sound: Sound,
  soundName: string,
  loop: boolean = false,
): Promise<boolean> => {
  return new Promise(resolve => {
    try {
      sound.setVolume(1.0);
      sound.setNumberOfLoops(loop ? -1 : 0);

      const didPlay = sound.play(success => {
        if (!success) {
          console.error(`[SoundManager] Playback failed: ${soundName}`);
        } else {
          console.log(`[SoundManager] Playback completed: ${soundName}`);
        }
        isPlayingStatus[soundName] = false;

        if (!loop) {
          sound.release();
          delete soundObjectsRef[soundName];
        }
      });

      isPlayingStatus[soundName] = true;
      console.log(
        `[SoundManager] play() returned: ${didPlay} for ${soundName}`,
      );
      resolve(true);
    } catch (e) {
      console.error(`[SoundManager] Error playing sound: ${soundName}`, e);
      resolve(false);
    }
  });
};

/**
 * Play Aarti sound - with looping
 */
export const playAarti = async (soundName: string = 'aarti'): Promise<void> => {
  try {
    console.log(`[SoundManager] playAarti called: ${soundName}`);

    // Ensure audio session is active
    if (Platform.OS === 'android') {
      Sound.setActive(true);
    }

    // Release existing sound if any
    if (soundObjectsRef[soundName]) {
      try {
        soundObjectsRef[soundName].stop();
        soundObjectsRef[soundName].release();
      } catch (e) {
        console.log('[SoundManager] Error releasing existing sound:', e);
      }
      delete soundObjectsRef[soundName];
    }

    console.log(`[SoundManager] Loading aarti sound: ${soundName}`);
    const sound = await loadSound(soundName);
    console.log(`[SoundManager] Playing aarti: ${soundName}`);
    await playSound(sound, soundName, true);

    console.log(`[SoundManager] Aarti started: ${soundName}`);
  } catch (error) {
    console.error('[SoundManager] playAarti error:', error);
  }
};

/**
 * Stop Aarti
 */
export const stopAarti = async (soundName: string = 'aarti'): Promise<void> => {
  try {
    if (soundObjectsRef[soundName]) {
      console.log(`[SoundManager] Stopping aarti: ${soundName}`);
      soundObjectsRef[soundName].stop();
      soundObjectsRef[soundName].release();
      delete soundObjectsRef[soundName];
      isPlayingStatus[soundName] = false;
    }
  } catch (error) {
    console.error('[SoundManager] Stop aarti error:', error);
  }
};

/**
 * Play a sound effect (bell, shankh, etc.) - non-looping
 */
export const playEffect = async (soundName: string): Promise<void> => {
  try {
    console.log(`[SoundManager] playEffect called: ${soundName}`);

    // Ensure audio session is active
    if (Platform.OS === 'android') {
      Sound.setActive(true);
    }

    // Release existing sound if any
    if (soundObjectsRef[soundName]) {
      try {
        soundObjectsRef[soundName].stop();
        soundObjectsRef[soundName].release();
      } catch (e) {
        console.log('[SoundManager] Error releasing existing sound:', e);
      }
      delete soundObjectsRef[soundName];
    }

    console.log(`[SoundManager] Loading effect: ${soundName}`);
    const sound = await loadSound(soundName);
    console.log(`[SoundManager] Playing effect: ${soundName}`);
    await playSound(sound, soundName, false);

    console.log(`[SoundManager] Effect played: ${soundName}`);
  } catch (error) {
    console.error(`[SoundManager] playEffect error for ${soundName}:`, error);
  }
};

/**
 * Play bell sound (convenience function)
 */
export const playBell = (): Promise<void> => {
  console.log('[SoundManager] playBell called');
  return playEffect('bell');
};

/**
 * Play shankh sound (convenience function)
 */
export const playShankh = (): Promise<void> => {
  console.log('[SoundManager] playShankh called');
  return playEffect('shankh');
};

/**
 * Play multiple sounds simultaneously
 */
export const playMultipleSounds = async (
  soundNames: string[],
): Promise<void> => {
  await Promise.all(
    soundNames.map(async soundName => {
      if (soundName === 'aarti') {
        await playAarti(soundName);
      } else {
        await playEffect(soundName);
      }
    }),
  );
};

/**
 * Check if Aarti is playing
 */
export const isAartiPlaying = (soundName: string = 'aarti'): boolean => {
  return isPlayingStatus[soundName] || false;
};

/**
 * Stop a specific sound effect
 */
export const stopEffect = async (soundName: string): Promise<void> => {
  if (soundObjectsRef[soundName]) {
    soundObjectsRef[soundName].stop();
    isPlayingStatus[soundName] = false;
  }
};

/**
 * Stop all sounds and cleanup
 */
export const stopAllSounds = async (): Promise<void> => {
  try {
    const soundKeys = Object.keys(soundObjectsRef);
    console.log(`[SoundManager] Stopping all sounds: ${soundKeys.join(', ')}`);

    for (const key of soundKeys) {
      if (soundObjectsRef[key]) {
        soundObjectsRef[key].stop();
        soundObjectsRef[key].release();
      }
    }

    Object.keys(soundObjectsRef).forEach(key => {
      delete soundObjectsRef[key];
      isPlayingStatus[key] = false;
    });
  } catch (error) {
    console.error('[SoundManager] Stop all sounds error:', error);
  }
};

/**
 * Cleanup - call when component unmounts
 */
export const cleanup = async (): Promise<void> => {
  await stopAllSounds();
};

/**
 * Preload all sounds for faster playback
 */
export const preloadSounds = async (): Promise<void> => {
  try {
    initAudio();
    console.log('[SoundManager] Preloading sounds...');

    const soundKeys = Object.keys(SOUND_FILES);
    for (const key of soundKeys) {
      try {
        await loadSound(key);
        console.log(`[SoundManager] Preloaded: ${key}`);
      } catch (error) {
        console.error(`[SoundManager] Failed to preload: ${key}`, error);
      }
    }

    console.log('[SoundManager] Sounds preloading complete');
  } catch (error) {
    console.error('[SoundManager] Preload sounds error:', error);
  }
};

export default {
  preloadSounds,
  playAarti,
  stopAarti,
  playEffect,
  playBell,
  playShankh,
  playMultipleSounds,
  isAartiPlaying,
  stopEffect,
  stopAllSounds,
  cleanup,
};
