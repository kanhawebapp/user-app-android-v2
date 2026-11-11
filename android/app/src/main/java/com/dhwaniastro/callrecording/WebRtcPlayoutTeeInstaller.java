package com.DhwaniAstro.app.callrecording;

import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;
import android.util.Log;

import androidx.annotation.Nullable;

import org.webrtc.audio.JavaAudioDeviceModule;

import java.lang.reflect.Field;

/**
 * Swaps WebRTC's internal {@link AudioTrack} for a {@link TeeingAudioTrack} so decoded
 * remote/playout PCM can be recorded.
 *
 * Note: {@code org.webrtc.AudioTrackSink} is NOT present in org.jitsi:webrtc:124.0.0
 * (verified: only {@code VideoTrack.addSink} exists). Playout tee is the supported
 * way to obtain decoded remote PCM without capturing the loudspeaker.
 *
 * Safe point: {@link JavaAudioDeviceModule.AudioTrackStateCallback#onWebRtcAudioTrackStart()}
 * runs on the playout thread before the write loop, so the field swap is visible to later writes.
 */
public final class WebRtcPlayoutTeeInstaller {
    private static final String TAG = "WebRtcPlayoutTee";

    private static volatile JavaAudioDeviceModule admRef;
    private static volatile boolean installed;

    private WebRtcPlayoutTeeInstaller() {}

    public static void bindAudioDeviceModule(JavaAudioDeviceModule adm) {
        admRef = adm;
        installed = false;
    }

    public static synchronized void installIfNeeded() {
        if (installed) {
            return;
        }
        JavaAudioDeviceModule adm = admRef;
        if (adm == null) {
            Log.w(TAG, "No ADM bound — cannot install playout tee");
            return;
        }

        try {
            Object output = getField(adm, "audioOutput");
            if (output == null) {
                Log.w(TAG, "WebRtcAudioTrack missing on ADM");
                return;
            }

            Object trackObj = getField(output, "audioTrack");
            if (!(trackObj instanceof AudioTrack)) {
                Log.w(TAG, "audioTrack not created yet");
                return;
            }
            AudioTrack current = (AudioTrack) trackObj;
            if (current instanceof TeeingAudioTrack) {
                installed = true;
                return;
            }

            AudioAttributes attrs = current.getAudioAttributes();
            AudioFormat format = current.getFormat();
            int sampleRate = format.getSampleRate() > 0 ? format.getSampleRate() : current.getSampleRate();
            int channelCount = Math.max(1, format.getChannelCount());
            int channelMask =
                    channelCount >= 2
                            ? AudioFormat.CHANNEL_OUT_STEREO
                            : AudioFormat.CHANNEL_OUT_MONO;
            int audioFormat =
                    format.getEncoding() != AudioFormat.ENCODING_INVALID
                            ? format.getEncoding()
                            : AudioFormat.ENCODING_PCM_16BIT;

            int minBuf = AudioTrack.getMinBufferSize(sampleRate, channelMask, audioFormat);
            int bufferBytes = Math.max(minBuf, 0);
            try {
                int frames = current.getBufferSizeInFrames();
                int bytesPerFrame = channelCount * 2;
                bufferBytes = Math.max(bufferBytes, frames * bytesPerFrame);
            } catch (Throwable ignored) {
            }
            if (bufferBytes <= 0) {
                bufferBytes = sampleRate * channelCount * 2 / 5;
            }

            int sessionId = current.getAudioSessionId();
            TeeingAudioTrack tee =
                    new TeeingAudioTrack(
                            attrs,
                            format,
                            bufferBytes,
                            AudioTrack.MODE_STREAM,
                            sessionId,
                            (pcm, sr, ch) ->
                                    CallRecordingAudioTap.getInstance()
                                            .onRemotePlayoutSamples(pcm, sr, ch));

            tee.play();
            setField(output, "audioTrack", tee);

            try {
                current.stop();
            } catch (Throwable ignored) {
            }
            try {
                current.release();
            } catch (Throwable ignored) {
            }

            installed = true;
            Log.i(
                    TAG,
                    "Installed TeeingAudioTrack sampleRate="
                            + sampleRate
                            + " channels="
                            + channelCount
                            + " bufferBytes="
                            + bufferBytes);
        } catch (Throwable t) {
            Log.e(TAG, "Failed to install playout tee", t);
        }
    }

    public static synchronized void markStopped() {
        installed = false;
    }

    @Nullable
    private static Object getField(Object target, String name) throws Exception {
        Class<?> cls = target.getClass();
        while (cls != null) {
            try {
                Field field = cls.getDeclaredField(name);
                field.setAccessible(true);
                return field.get(target);
            } catch (NoSuchFieldException e) {
                cls = cls.getSuperclass();
            }
        }
        throw new NoSuchFieldException(name);
    }

    private static void setField(Object target, String name, Object value) throws Exception {
        Class<?> cls = target.getClass();
        while (cls != null) {
            try {
                Field field = cls.getDeclaredField(name);
                field.setAccessible(true);
                field.set(target, value);
                return;
            } catch (NoSuchFieldException e) {
                cls = cls.getSuperclass();
            }
        }
        throw new NoSuchFieldException(name);
    }
}
