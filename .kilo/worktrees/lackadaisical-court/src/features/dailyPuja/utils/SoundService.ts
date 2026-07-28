import {NativeModules, Platform} from 'react-native';

// Define the native module interface
interface RNSoundPoolInterface {
  playSound(soundName: string, loop: boolean): Promise<boolean>;
  stopSound(soundName: string): Promise<void>;
  stopAllSounds(): Promise<void>;
  preloadSound(soundName: string): Promise<boolean>;
}

const {RNSoundPool} = NativeModules;

// Sound file mapping
const SOUND_FILES: Record<string, string> = {
  aarti: 'aarti',
  bell: 'bell',
  shankh: 'shankh',
};

// Track playing status
const isPlaying: Record<string, boolean> = {};

// Try to use native module, fallback to react-native-sound if not available
// const useNativeModule = RNSoundPool != null;
const useNativeModule = false;

// Fallback: react-native-sound
import Sound from 'react-native-sound';
const soundObjects: Record<string, Sound> = {};

const initAudio = (): void => {
  if (Platform.OS === 'ios') {
    Sound.setCategory('Playback', true);
  } else {
    Sound.setCategory('Playback', true);
  }
  console.log(
    '[SoundService] Audio initialized, using native:',
    useNativeModule,
  );
};

initAudio();

// Load sound using react-native-sound (fallback)
const loadSound = (soundName: string): Promise<Sound> => {
  return new Promise((resolve, reject) => {
    const soundFile = SOUND_FILES[soundName];

    if (!soundFile) {
      reject(new Error(`Unknown sound: ${soundName}`));
      return;
    }

    const sound = new Sound(soundFile, undefined, error => {
      if (error) {
        console.log('[SoundService] Failed to load ' + soundFile + ':', error);
        reject(error);
        return;
      }

      soundObjects[soundName] = sound;
      console.log('[SoundService] Loaded: ' + soundName);
      resolve(sound);
    });
  });
};

// Play sound effect (non-looping)
export const playEffect = async (soundName: string): Promise<void> => {
  try {
    console.log(
      '[SoundService] playEffect: ' +
        soundName +
        ', native: ' +
        useNativeModule,
    );

    // Use native module if available
    if (useNativeModule) {
      await RNSoundPool.playSound(soundName, false);
      isPlaying[soundName] = true;
      console.log('[SoundService] Native playEffect: ' + soundName);
      return;
    }

    // Fallback to react-native-sound
    if (Platform.OS === 'android') {
      Sound.setActive(true);
    }

    // Stop existing sound
    if (soundObjects[soundName]) {
      try {
        soundObjects[soundName].stop();
        soundObjects[soundName].release();
      } catch (e) {
        // Ignore
      }
      delete soundObjects[soundName];
    }

    const sound = await loadSound(soundName);

    return new Promise<void>((resolve, reject) => {
      try {
        sound.setVolume(1.0);
        sound.setNumberOfLoops(0);

        const didPlay = sound.play(success => {
          isPlaying[soundName] = false;
          if (!success) {
            console.log('[SoundService] Playback failed: ' + soundName);
          }
          // Release after playing
          sound.release();
          delete soundObjects[soundName];
        });

        isPlaying[soundName] = true;
        console.log(
          '[SoundService] Playing: ' + soundName + ', result: ' + didPlay,
        );
        resolve();
      } catch (e) {
        console.log('[SoundService] Error playing ' + soundName + ':', e);
        reject(e);
      }
    });
  } catch (error) {
    console.log(
      '[SoundService] playEffect error for ' + soundName + ':',
      error,
    );
  }
};

// Play Aarti (looping)
export const playAarti = async (soundName: string = 'aarti'): Promise<void> => {
  try {
    console.log(
      '[SoundService] playAarti: ' + soundName + ', native: ' + useNativeModule,
    );

    // Use native module if available
    if (useNativeModule) {
      await RNSoundPool.playSound(soundName, true);
      isPlaying[soundName] = true;
      console.log('[SoundService] Native playAarti: ' + soundName);
      return;
    }

    // Fallback to react-native-sound
    if (Platform.OS === 'android') {
      Sound.setActive(true);
    }

    // Stop existing
    if (soundObjects[soundName]) {
      try {
        soundObjects[soundName].stop();
        soundObjects[soundName].release();
      } catch (e) {
        // Ignore
      }
      delete soundObjects[soundName];
    }

    const sound = await loadSound(soundName);

    return new Promise<void>((resolve, reject) => {
      try {
        sound.setVolume(1.0);
        sound.setNumberOfLoops(-1); // Loop indefinitely

        const didPlay = sound.play(success => {
          if (!success) {
            console.log('[SoundService] Aarti playback failed: ' + soundName);
          }
        });

        isPlaying[soundName] = true;
        soundObjects[soundName] = sound;
        console.log(
          '[SoundService] Aarti playing: ' + soundName + ', result: ' + didPlay,
        );
        resolve();
      } catch (e) {
        console.log('[SoundService] Error playing aarti ' + soundName + ':', e);
        reject(e);
      }
    });
  } catch (error) {
    console.log('[SoundService] playAarti error for ' + soundName + ':', error);
  }
};

// Stop Aarti
export const stopAarti = async (soundName: string = 'aarti'): Promise<void> => {
  try {
    console.log(
      '[SoundService] stopAarti: ' + soundName + ', native: ' + useNativeModule,
    );

    // Use native module if available
    if (useNativeModule) {
      await RNSoundPool.stopSound(soundName);
      isPlaying[soundName] = false;
      return;
    }

    // Fallback
    if (soundObjects[soundName]) {
      console.log('[SoundService] Stopping aarti: ' + soundName);
      soundObjects[soundName].stop();
      soundObjects[soundName].release();
      delete soundObjects[soundName];
      isPlaying[soundName] = false;
    }
  } catch (error) {
    console.log('[SoundService] Stop aarti error:', error);
  }
};

// Play bell (convenience)
export const playBell = (): Promise<void> => {
  console.log('[SoundService] playBell');
  return playEffect('bell');
};

// Play shankh (convenience)
export const playShankh = (): Promise<void> => {
  console.log('[SoundService] playShankh');
  return playEffect('shankh');
};

// Check if aarti is playing
export const isAartiPlaying = (soundName: string = 'aarti'): boolean => {
  return isPlaying[soundName] || false;
};

// Stop all sounds
export const stopAllSounds = async (): Promise<void> => {
  try {
    console.log('[SoundService] stopAllSounds, native: ' + useNativeModule);

    // Use native module if available
    if (useNativeModule) {
      await RNSoundPool.stopAllSounds();
      Object.keys(isPlaying).forEach(key => {
        isPlaying[key] = false;
      });
      return;
    }

    // Fallback
    const keys = Object.keys(soundObjects);
    console.log('[SoundService] Stopping all: ' + keys.join(', '));

    for (const key of keys) {
      if (soundObjects[key]) {
        soundObjects[key].stop();
        soundObjects[key].release();
      }
    }

    Object.keys(soundObjects).forEach(key => {
      delete soundObjects[key];
      isPlaying[key] = false;
    });
  } catch (error) {
    console.log('[SoundService] Stop all error:', error);
  }
};

// Cleanup
export const cleanup = async (): Promise<void> => {
  await stopAllSounds();
};

// Preload sounds
export const preloadSounds = async (): Promise<void> => {
  try {
    console.log('[SoundService] Preloading sounds...');

    // Use native module if available
    if (useNativeModule) {
      for (const key of Object.keys(SOUND_FILES)) {
        try {
          await RNSoundPool.preloadSound(key);
          console.log('[SoundService] Preloaded (native): ' + key);
        } catch (error) {
          console.log(
            '[SoundService] Failed to preload (native): ' + key,
            error,
          );
        }
      }
      console.log('[SoundService] Preloading complete (native)');
      return;
    }

    // Fallback to react-native-sound
    const keys = Object.keys(SOUND_FILES);
    for (const key of keys) {
      try {
        await loadSound(key);
        console.log('[SoundService] Preloaded: ' + key);
      } catch (error) {
        console.log('[SoundService] Failed to preload: ' + key, error);
      }
    }

    console.log('[SoundService] Preloading complete');
  } catch (error) {
    console.log('[SoundService] Preload error:', error);
  }
};

export default {
  preloadSounds,
  playAarti,
  stopAarti,
  playEffect,
  playBell,
  playShankh,
  isAartiPlaying,
  stopAllSounds,
  cleanup,
};
