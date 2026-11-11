package com.DhwaniAstro.app.callrecording;

import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioTrack;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import java.nio.ByteBuffer;

/**
 * {@link AudioTrack} that forwards PCM to a listener before playing.
 *
 * Used to tap WebRTC remote/playout audio because org.jitsi:webrtc:124.0.0 does
 * not ship {@code org.webrtc.AudioTrackSink} / {@code AudioTrack.addSink()}.
 */
public class TeeingAudioTrack extends AudioTrack {
    public interface PlayoutListener {
        void onPlayoutPcm(@NonNull byte[] pcm16, int sampleRate, int channelCount);
    }

    private static final String TAG = "TeeingAudioTrack";

    @Nullable private final PlayoutListener listener;

    public TeeingAudioTrack(
            @NonNull AudioAttributes attributes,
            @NonNull AudioFormat format,
            int bufferSizeInBytes,
            int mode,
            int sessionId,
            @Nullable PlayoutListener listener) {
        super(attributes, format, bufferSizeInBytes, mode, sessionId);
        this.listener = listener;
    }

    @Override
    public int write(@NonNull ByteBuffer audioData, int sizeInBytes, int writeMode) {
        teeFromByteBuffer(audioData, sizeInBytes);
        return super.write(audioData, sizeInBytes, writeMode);
    }

    @Override
    public int write(
            @NonNull ByteBuffer audioData, int sizeInBytes, int writeMode, long timestamp) {
        teeFromByteBuffer(audioData, sizeInBytes);
        if (android.os.Build.VERSION.SDK_INT >= 23) {
            return super.write(audioData, sizeInBytes, writeMode, timestamp);
        }
        return super.write(audioData, sizeInBytes, writeMode);
    }

    @Override
    public int write(@NonNull byte[] audioData, int offsetInBytes, int sizeInBytes) {
        teeFromByteArray(audioData, offsetInBytes, sizeInBytes);
        return super.write(audioData, offsetInBytes, sizeInBytes);
    }

    @Override
    public int write(@NonNull byte[] audioData, int offsetInBytes, int sizeInBytes, int writeMode) {
        teeFromByteArray(audioData, offsetInBytes, sizeInBytes);
        return super.write(audioData, offsetInBytes, sizeInBytes, writeMode);
    }

    private void teeFromByteBuffer(@Nullable ByteBuffer audioData, int sizeInBytes) {
        if (listener == null || audioData == null || sizeInBytes <= 0) {
            return;
        }
        try {
            ByteBuffer readonly = audioData.asReadOnlyBuffer();
            byte[] copy = new byte[sizeInBytes];
            int toRead = Math.min(sizeInBytes, readonly.remaining());
            if (toRead <= 0) {
                return;
            }
            readonly.get(copy, 0, toRead);
            if (toRead < sizeInBytes) {
                byte[] trimmed = new byte[toRead];
                System.arraycopy(copy, 0, trimmed, 0, toRead);
                copy = trimmed;
            }
            listener.onPlayoutPcm(copy, getSampleRate(), Math.max(1, getChannelCount()));
        } catch (Exception e) {
            Log.w(TAG, "teeFromByteBuffer failed", e);
        }
    }

    private void teeFromByteArray(@Nullable byte[] audioData, int offset, int sizeInBytes) {
        if (listener == null || audioData == null || sizeInBytes <= 0) {
            return;
        }
        try {
            byte[] copy = new byte[sizeInBytes];
            System.arraycopy(audioData, offset, copy, 0, sizeInBytes);
            listener.onPlayoutPcm(copy, getSampleRate(), Math.max(1, getChannelCount()));
        } catch (Exception e) {
            Log.w(TAG, "teeFromByteArray failed", e);
        }
    }
}
