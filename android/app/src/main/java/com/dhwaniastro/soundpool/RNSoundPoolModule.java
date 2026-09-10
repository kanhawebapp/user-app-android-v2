package com.DhwaniAstro.app.soundpool;

import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class RNSoundPoolModule extends ReactContextBaseJavaModule {
    private static final String TAG = "RNSoundPool";
    private final ReactApplicationContext reactContext;
    
    private SoundPool soundPool;
    private Map<String, Integer> soundIds = new HashMap<>();
    private Map<String, MediaPlayer> loopingPlayers = new HashMap<>();
    
    public RNSoundPoolModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        initSoundPool();
    }
    
    private void initSoundPool() {
        AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();
        
        soundPool = new SoundPool.Builder()
                .setMaxStreams(10)
                .setAudioAttributes(audioAttributes)
                .build();
        
        Log.d(TAG, "SoundPool initialized");
    }
    
    @NonNull
    @Override
    public String getName() {
        return "RNSoundPool";
    }
    
    @ReactMethod
    public void playSound(String soundName, boolean loop, Promise promise) {
        try {
            Log.d(TAG, "playSound: " + soundName + ", loop: " + loop);
            
            // Stop any existing sound with the same name
            stopSoundInternal(soundName);
            
            // For looping sounds (like aarti), use MediaPlayer
            if (loop) {
                int resId = reactContext.getResources().getIdentifier(soundName, "raw", reactContext.getPackageName());
                
                if (resId == 0) {
                    Log.e(TAG, "Sound resource not found: " + soundName);
                    promise.resolve(false);
                    return;
                }
                
                MediaPlayer player = MediaPlayer.create(reactContext, resId);
                if (player != null) {
                    player.setLooping(true);
                    player.start();
                    loopingPlayers.put(soundName, player);
                    Log.d(TAG, "Playing looping sound: " + soundName);
                    promise.resolve(true);
                } else {
                    Log.e(TAG, "Failed to create MediaPlayer for: " + soundName);
                    promise.resolve(false);
                }
                return;
            }
            
            // For non-looping sounds, use SoundPool
            Integer soundId = soundIds.get(soundName);
            
            if (soundId == null) {
                int resId = reactContext.getResources().getIdentifier(soundName, "raw", reactContext.getPackageName());
                
                if (resId == 0) {
                    Log.e(TAG, "Sound resource not found: " + soundName);
                    promise.resolve(false);
                    return;
                }
                
                soundId = soundPool.load(reactContext, resId, 1);
                soundIds.put(soundName, soundId);
                
                // Wait for sound to load, then play
                // For simplicity, we'll play immediately and it will work once loaded
            }
            
            int streamId = soundPool.play(soundId, 1.0f, 1.0f, 1, 0, 1.0f);
            Log.d(TAG, "Playing sound: " + soundName + ", streamId: " + streamId);
            promise.resolve(streamId != 0);
            
        } catch (Exception e) {
            Log.e(TAG, "Error playing sound: " + soundName, e);
            promise.resolve(false);
        }
    }
    
    @ReactMethod
    public void stopSound(String soundName, Promise promise) {
        try {
            stopSoundInternal(soundName);
            promise.resolve(null);
        } catch (Exception e) {
            Log.e(TAG, "Error stopping sound: " + soundName, e);
            promise.reject(e);
        }
    }
    
    private void stopSoundInternal(String soundName) {
        // Stop MediaPlayer if exists
        MediaPlayer player = loopingPlayers.get(soundName);
        if (player != null) {
            player.stop();
            player.release();
            loopingPlayers.remove(soundName);
            Log.d(TAG, "Stopped looping sound: " + soundName);
        }
    }
    
    @ReactMethod
    public void stopAllSounds(Promise promise) {
        try {
            // Stop all looping players
            for (Map.Entry<String, MediaPlayer> entry : loopingPlayers.entrySet()) {
                MediaPlayer player = entry.getValue();
                player.stop();
                player.release();
            }
            loopingPlayers.clear();
            
            // Release SoundPool and recreate
            if (soundPool != null) {
                soundPool.release();
            }
            soundIds.clear();
            initSoundPool();
            
            Log.d(TAG, "All sounds stopped");
            promise.resolve(null);
        } catch (Exception e) {
            Log.e(TAG, "Error stopping all sounds", e);
            promise.reject(e);
        }
    }
    
    @ReactMethod
    public void preloadSound(String soundName, Promise promise) {
        try {
            int resId = reactContext.getResources().getIdentifier(soundName, "raw", reactContext.getPackageName());
            
            if (resId == 0) {
                Log.e(TAG, "Sound resource not found for preload: " + soundName);
                promise.resolve(false);
                return;
            }
            
            int soundId = soundPool.load(reactContext, resId, 1);
            soundIds.put(soundName, soundId);
            
            Log.d(TAG, "Preloaded sound: " + soundName);
            promise.resolve(true);
        } catch (Exception e) {
            Log.e(TAG, "Error preloading sound: " + soundName, e);
            promise.resolve(false);
        }
    }
}

