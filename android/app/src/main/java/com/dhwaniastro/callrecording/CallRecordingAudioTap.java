package com.DhwaniAstro.app.callrecording;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.webrtc.audio.JavaAudioDeviceModule;

import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Fan-in for:
 * - Local WebRTC mic PCM ({@link JavaAudioDeviceModule.SamplesReadyCallback})
 * - Remote/playout PCM ({@link TeeingAudioTrack})
 */
public final class CallRecordingAudioTap {
    public interface SampleListener {
        void onMicSamples(JavaAudioDeviceModule.AudioSamples samples);

        void onRemotePlayoutSamples(@NonNull byte[] pcm16, int sampleRate, int channelCount);
    }

    private static final CallRecordingAudioTap INSTANCE = new CallRecordingAudioTap();

    private final AtomicBoolean capturing = new AtomicBoolean(false);
    private final AtomicReference<SampleListener> listener = new AtomicReference<>(null);

    private CallRecordingAudioTap() {}

    public static CallRecordingAudioTap getInstance() {
        return INSTANCE;
    }

    public void setListener(@Nullable SampleListener sampleListener) {
        listener.set(sampleListener);
    }

    public void startCapturing() {
        capturing.set(true);
    }

    public void stopCapturing() {
        capturing.set(false);
    }

    public boolean isCapturing() {
        return capturing.get();
    }

    public void onMicSamples(JavaAudioDeviceModule.AudioSamples samples) {
        if (!capturing.get() || samples == null) {
            return;
        }
        SampleListener active = listener.get();
        if (active != null) {
            active.onMicSamples(samples);
        }
    }

    public void onRemotePlayoutSamples(@NonNull byte[] pcm16, int sampleRate, int channelCount) {
        if (!capturing.get() || pcm16.length == 0) {
            return;
        }
        SampleListener active = listener.get();
        if (active != null) {
            active.onRemotePlayoutSamples(pcm16, sampleRate, channelCount);
        }
    }
}
