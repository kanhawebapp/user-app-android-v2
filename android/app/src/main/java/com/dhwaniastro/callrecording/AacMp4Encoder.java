package com.DhwaniAstro.app.callrecording;

import android.media.AudioFormat;
import android.media.MediaCodec;
import android.media.MediaCodecInfo;
import android.media.MediaFormat;
import android.media.MediaMuxer;
import android.os.Build;
import android.util.Log;

import androidx.annotation.Nullable;

import java.io.File;
import java.io.IOException;
import java.nio.ByteBuffer;

/**
 * Encodes mono PCM-16 LE into AAC-LC and muxes an MPEG-4 (.mp4) container.
 *
 * AAC-LC consumes exactly {@link #SAMPLES_PER_FRAME} PCM samples per encoded frame.
 * Feeding larger/arbitrary PCM chunks makes many Android encoders advance timestamps
 * by only one frame per input buffer while still encoding all samples — the file then
 * plays faster than real time. This encoder therefore aggregates PCM and feeds the
 * codec one 1024-sample frame at a time with PTS derived from sample count.
 */
final class AacMp4Encoder {
    private static final String TAG = "AacMp4Encoder";
    private static final int TIMEOUT_US = 10_000;
    /** AAC-LC frame size in PCM samples (per channel). */
    private static final int SAMPLES_PER_FRAME = 1024;

    private final int sampleRate;
    private final int channelCount;
    private final int bytesPerFrame;
    private final long frameDurationUs;

    /** Pending PCM bytes waiting to fill a full AAC frame. */
    private final byte[] pending;
    private int pendingBytes = 0;

    @Nullable private MediaCodec encoder;
    @Nullable private MediaMuxer muxer;
    private int trackIndex = -1;
    private boolean muxerStarted = false;
    private boolean finished = false;

    /** Number of AAC frames queued to the codec (drives input PTS). */
    private long inputFrameIndex = 0;
    /** Number of AAC frames written to the muxer (drives muxer PTS). */
    private long outputFrameIndex = 0;
    private long lastMuxerPtsUs = -1;

    AacMp4Encoder(File outputFile, int sampleRate, int channelCount, int bitRate)
            throws IOException {
        if (sampleRate <= 0 || channelCount <= 0 || bitRate <= 0) {
            throw new IllegalArgumentException("Invalid AAC encoder parameters");
        }
        this.sampleRate = sampleRate;
        this.channelCount = channelCount;
        this.bytesPerFrame = SAMPLES_PER_FRAME * channelCount * 2; // 16-bit
        this.frameDurationUs = (1_000_000L * SAMPLES_PER_FRAME) / sampleRate;
        this.pending = new byte[bytesPerFrame];

        MediaFormat format =
                MediaFormat.createAudioFormat(
                        MediaFormat.MIMETYPE_AUDIO_AAC, sampleRate, channelCount);
        format.setInteger(
                MediaFormat.KEY_AAC_PROFILE, MediaCodecInfo.CodecProfileLevel.AACObjectLC);
        format.setInteger(MediaFormat.KEY_BIT_RATE, bitRate);
        format.setInteger(MediaFormat.KEY_MAX_INPUT_SIZE, bytesPerFrame);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            format.setInteger(MediaFormat.KEY_PCM_ENCODING, AudioFormat.ENCODING_PCM_16BIT);
        }

        MediaCodec codec = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_AUDIO_AAC);
        try {
            codec.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE);
            codec.start();
        } catch (RuntimeException e) {
            try {
                codec.release();
            } catch (RuntimeException ignored) {
                // ignore
            }
            throw e;
        }

        MediaMuxer mediaMuxer;
        try {
            mediaMuxer =
                    new MediaMuxer(
                            outputFile.getAbsolutePath(),
                            MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4);
        } catch (IOException | RuntimeException e) {
            try {
                codec.stop();
            } catch (RuntimeException ignored) {
                // ignore
            }
            try {
                codec.release();
            } catch (RuntimeException ignored) {
                // ignore
            }
            throw e;
        }

        this.encoder = codec;
        this.muxer = mediaMuxer;
        Log.i(
                TAG,
                "AAC-LC encoder started"
                        + " sr="
                        + sampleRate
                        + " ch="
                        + channelCount
                        + " bitrate="
                        + bitRate
                        + " frameSamples="
                        + SAMPLES_PER_FRAME
                        + " frameUs="
                        + frameDurationUs
                        + " path="
                        + outputFile.getAbsolutePath());
    }

    synchronized void encodePcm(byte[] pcm16Le) throws IOException {
        if (finished || encoder == null || pcm16Le == null || pcm16Le.length == 0) {
            return;
        }

        int offset = 0;
        // Drop a trailing odd byte so we never split a 16-bit sample.
        int remaining = pcm16Le.length - (pcm16Le.length % (2 * channelCount));

        while (offset < remaining) {
            int need = bytesPerFrame - pendingBytes;
            int copy = Math.min(need, remaining - offset);
            System.arraycopy(pcm16Le, offset, pending, pendingBytes, copy);
            pendingBytes += copy;
            offset += copy;

            if (pendingBytes == bytesPerFrame) {
                queueFrame(pending, 0, bytesPerFrame, false);
                pendingBytes = 0;
                drainEncoder(false);
            }
        }
    }

    /** Signals EOS, drains remaining buffers, then releases codec/muxer. */
    synchronized void finish() throws IOException {
        if (finished) {
            return;
        }
        finished = true;
        try {
            if (encoder != null) {
                if (pendingBytes > 0) {
                    // Pad the last partial AAC frame with silence.
                    for (int i = pendingBytes; i < bytesPerFrame; i++) {
                        pending[i] = 0;
                    }
                    queueFrame(pending, 0, bytesPerFrame, false);
                    pendingBytes = 0;
                }
                queueFrame(null, 0, 0, true);
                drainEncoder(true);
            }
        } finally {
            releaseResources();
        }
    }

    /** Best-effort cleanup for failed start/stop paths. */
    synchronized void releaseQuietly() {
        finished = true;
        releaseResources();
    }

    private void queueFrame(@Nullable byte[] pcm, int offset, int size, boolean eos)
            throws IOException {
        MediaCodec codec = encoder;
        if (codec == null) {
            return;
        }

        int attempts = 0;
        final int maxAttempts = eos ? 100 : 50;
        while (attempts < maxAttempts) {
            int inputIndex = codec.dequeueInputBuffer(TIMEOUT_US);
            if (inputIndex >= 0) {
                ByteBuffer inputBuffer = codec.getInputBuffer(inputIndex);
                if (inputBuffer == null) {
                    throw new IOException("AAC encoder input buffer is null");
                }
                inputBuffer.clear();
                if (eos) {
                    codec.queueInputBuffer(
                            inputIndex, 0, 0, ptsForInputFrame(inputFrameIndex),
                            MediaCodec.BUFFER_FLAG_END_OF_STREAM);
                } else {
                    if (size > inputBuffer.remaining()) {
                        throw new IOException(
                                "AAC input buffer too small: need="
                                        + size
                                        + " cap="
                                        + inputBuffer.remaining());
                    }
                    inputBuffer.put(pcm, offset, size);
                    long ptsUs = ptsForInputFrame(inputFrameIndex);
                    codec.queueInputBuffer(inputIndex, 0, size, ptsUs, 0);
                    inputFrameIndex++;
                }
                return;
            }

            drainEncoder(false);
            attempts++;
        }
        throw new IOException(
                eos ? "AAC encoder EOS input timeout" : "AAC encoder input buffer timeout");
    }

    private long ptsForInputFrame(long frameIndex) {
        return frameIndex * frameDurationUs;
    }

    private void drainEncoder(boolean endOfStream) throws IOException {
        MediaCodec codec = encoder;
        MediaMuxer mediaMuxer = muxer;
        if (codec == null || mediaMuxer == null) {
            return;
        }

        MediaCodec.BufferInfo bufferInfo = new MediaCodec.BufferInfo();
        int idleTries = 0;
        final int maxIdleTries = endOfStream ? 100 : 1; // ~1s max wait for EOS
        while (true) {
            int outputIndex = codec.dequeueOutputBuffer(bufferInfo, TIMEOUT_US);
            if (outputIndex == MediaCodec.INFO_TRY_AGAIN_LATER) {
                if (!endOfStream) {
                    return;
                }
                idleTries++;
                if (idleTries >= maxIdleTries) {
                    Log.w(TAG, "Timed out waiting for AAC encoder EOS");
                    return;
                }
                continue;
            }
            idleTries = 0;
            if (outputIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED) {
                if (muxerStarted) {
                    throw new IOException("AAC output format changed twice");
                }
                MediaFormat newFormat = codec.getOutputFormat();
                trackIndex = mediaMuxer.addTrack(newFormat);
                mediaMuxer.start();
                muxerStarted = true;
                Log.i(TAG, "Muxer started format=" + newFormat);
                continue;
            }
            if (outputIndex < 0) {
                continue;
            }

            ByteBuffer outputBuffer = codec.getOutputBuffer(outputIndex);
            if (outputBuffer == null) {
                codec.releaseOutputBuffer(outputIndex, false);
                throw new IOException("AAC encoder output buffer is null");
            }

            if ((bufferInfo.flags & MediaCodec.BUFFER_FLAG_CODEC_CONFIG) != 0) {
                // CSD is delivered via OUTPUT_FORMAT_CHANGED for the muxer track.
                bufferInfo.size = 0;
            }

            if (bufferInfo.size > 0) {
                if (!muxerStarted) {
                    codec.releaseOutputBuffer(outputIndex, false);
                    throw new IOException("AAC muxer not started before sample data");
                }
                // Force sample-based PTS: do not trust encoder-reported timestamps.
                long ptsUs = outputFrameIndex * frameDurationUs;
                if (ptsUs <= lastMuxerPtsUs) {
                    ptsUs = lastMuxerPtsUs + 1;
                }
                bufferInfo.presentationTimeUs = ptsUs;
                lastMuxerPtsUs = ptsUs;
                outputFrameIndex++;

                outputBuffer.position(bufferInfo.offset);
                outputBuffer.limit(bufferInfo.offset + bufferInfo.size);
                mediaMuxer.writeSampleData(trackIndex, outputBuffer, bufferInfo);
            }

            boolean eos = (bufferInfo.flags & MediaCodec.BUFFER_FLAG_END_OF_STREAM) != 0;
            codec.releaseOutputBuffer(outputIndex, false);
            if (eos) {
                return;
            }
        }
    }

    private void releaseResources() {
        if (encoder != null) {
            try {
                encoder.stop();
            } catch (RuntimeException e) {
                Log.w(TAG, "encoder.stop failed", e);
            }
            try {
                encoder.release();
            } catch (RuntimeException e) {
                Log.w(TAG, "encoder.release failed", e);
            }
            encoder = null;
        }

        if (muxer != null) {
            try {
                if (muxerStarted) {
                    muxer.stop();
                }
            } catch (RuntimeException e) {
                Log.w(TAG, "muxer.stop failed", e);
            }
            try {
                muxer.release();
            } catch (RuntimeException e) {
                Log.w(TAG, "muxer.release failed", e);
            }
            muxer = null;
        }
        muxerStarted = false;
        trackIndex = -1;
        pendingBytes = 0;
    }
}
