package com.DhwaniAstro.app.callrecording;

import android.os.Process;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import org.webrtc.audio.JavaAudioDeviceModule;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Mixes:
 *  1) Local mic PCM from WebRTC SamplesReadyCallback
 *  2) Remote decoded PCM from WebRTC playout tee ({@link TeeingAudioTrack})
 *
 * Does NOT use UNPROCESSED AudioRecord / loudspeaker capture.
 */
public class CallAudioMixerRecorderModule extends ReactContextBaseJavaModule
        implements CallRecordingAudioTap.SampleListener {

    private static final String TAG = "CallAudioMixerRecorder";
    private static final int TARGET_SAMPLE_RATE = 48000;
    private static final int CHANNEL_COUNT = 1;
    private static final int QUEUE_CAPACITY = 128;

    private final AtomicBoolean recording = new AtomicBoolean(false);
    private final ArrayBlockingQueue<PcmChunk> localQueue = new ArrayBlockingQueue<>(QUEUE_CAPACITY);
    private final ArrayBlockingQueue<PcmChunk> remoteQueue = new ArrayBlockingQueue<>(QUEUE_CAPACITY);

    @Nullable private Thread mixThread;
    @Nullable private FileOutputStream wavOut;
    @Nullable private File outputFile;
    private long pcmBytesWritten = 0;
    private int outputSampleRate = TARGET_SAMPLE_RATE;

    private final AtomicLong localCallbacks = new AtomicLong();
    private final AtomicLong remoteCallbacks = new AtomicLong();
    private final AtomicLong localNonZero = new AtomicLong();
    private final AtomicLong remoteNonZero = new AtomicLong();
    private final AtomicLong mixedBuffers = new AtomicLong();
    private final AtomicInteger localPeak = new AtomicInteger();
    private final AtomicInteger remotePeak = new AtomicInteger();
    private final AtomicLong localAbsSum = new AtomicLong();
    private final AtomicLong remoteAbsSum = new AtomicLong();
    private final AtomicLong localSampleCount = new AtomicLong();
    private final AtomicLong remoteSampleCount = new AtomicLong();
    private volatile int lastRemoteSampleRate = 0;
    private volatile int lastRemoteChannels = 0;
    private volatile int lastRemoteBufferBytes = 0;

    public CallAudioMixerRecorderModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "CallAudioMixerRecorder";
    }

    @ReactMethod
    public void isAvailable(Promise promise) {
        promise.resolve(true);
    }

    @ReactMethod
    public void startRecorder(String path, Promise promise) {
        if (recording.get()) {
            promise.reject("ALREADY_RECORDING", "Call audio mixer is already recording");
            return;
        }

        try {
            // Ensure playout tee is installed if WebRTC audio already started.
            WebRtcPlayoutTeeInstaller.installIfNeeded();

            File file = new File(path.replace("file://", ""));
            File parent = file.getParentFile();
            if (parent != null && !parent.exists() && !parent.mkdirs()) {
                promise.reject("IO_ERROR", "Unable to create recording directory");
                return;
            }
            if (file.exists() && !file.delete()) {
                Log.w(TAG, "Could not delete existing file: " + file.getAbsolutePath());
            }

            outputFile = file;
            wavOut = new FileOutputStream(file);
            writeWavHeaderPlaceholder(wavOut);
            pcmBytesWritten = 0;
            outputSampleRate = TARGET_SAMPLE_RATE;
            resetDiagnostics();
            localQueue.clear();
            remoteQueue.clear();

            recording.set(true);
            CallRecordingAudioTap.getInstance().setListener(this);
            CallRecordingAudioTap.getInstance().startCapturing();

            mixThread = new Thread(this::mixLoop, "CallRec-Mix");
            mixThread.start();

            Log.i(TAG, "Two-way digital mixer started path=" + file.getAbsolutePath());
            promise.resolve(file.getAbsolutePath());
        } catch (Exception e) {
            Log.e(TAG, "startRecorder failed", e);
            stopInternal();
            promise.reject("START_FAILED", e.getMessage(), e);
        }
    }

    @ReactMethod
    public void stopRecorder(Promise promise) {
        if (!recording.get()) {
            promise.resolve(outputFile != null ? outputFile.getAbsolutePath() : null);
            return;
        }

        try {
            stopInternal();
            String path = outputFile != null ? outputFile.getAbsolutePath() : null;
            double durationSec =
                    outputSampleRate > 0 ? (pcmBytesWritten / 2.0) / outputSampleRate : 0;
            Log.i(
                    TAG,
                    "Two-way digital mixer stopped"
                            + " path="
                            + path
                            + " bytes="
                            + pcmBytesWritten
                            + " durationSec="
                            + String.format("%.2f", durationSec)
                            + " localCb="
                            + localCallbacks.get()
                            + " remoteCb="
                            + remoteCallbacks.get()
                            + " localNonZero="
                            + localNonZero.get()
                            + " remoteNonZero="
                            + remoteNonZero.get()
                            + " mixedBuffers="
                            + mixedBuffers.get()
                            + " localPeak="
                            + localPeak.get()
                            + " remotePeak="
                            + remotePeak.get()
                            + " localRms="
                            + formatRms(localAbsSum.get(), localSampleCount.get())
                            + " remoteRms="
                            + formatRms(remoteAbsSum.get(), remoteSampleCount.get())
                            + " remoteSr="
                            + lastRemoteSampleRate
                            + " remoteCh="
                            + lastRemoteChannels
                            + " remoteBuf="
                            + lastRemoteBufferBytes
                            + " localContributing="
                            + (localNonZero.get() > 0)
                            + " remoteContributing="
                            + (remoteNonZero.get() > 0));

            if (remoteCallbacks.get() == 0 || remoteNonZero.get() == 0) {
                Log.e(
                        TAG,
                        "Remote PCM missing or silent — TeeingAudioTrack may not be installed "
                                + "or remote track has no audio. Do NOT treat this as two-way success.");
            }
            if (localCallbacks.get() == 0 || localNonZero.get() == 0) {
                Log.e(TAG, "Local PCM missing or silent — SamplesReadyCallback may be inactive.");
            }

            promise.resolve(path);
        } catch (Exception e) {
            Log.e(TAG, "stopRecorder failed", e);
            promise.reject("STOP_FAILED", e.getMessage(), e);
        }
    }

    @Override
    public void onMicSamples(JavaAudioDeviceModule.AudioSamples samples) {
        if (!recording.get() || samples == null) {
            return;
        }
        byte[] data = samples.getData();
        if (data == null || data.length == 0) {
            return;
        }
        int sr = samples.getSampleRate() > 0 ? samples.getSampleRate() : TARGET_SAMPLE_RATE;
        int ch = Math.max(1, samples.getChannelCount());
        byte[] mono = toMonoPcm16(data, ch);
        Stats stats = analyzePcm16(mono);
        localCallbacks.incrementAndGet();
        localSampleCount.addAndGet(stats.samples);
        localAbsSum.addAndGet(stats.absSum);
        if (stats.peak > localPeak.get()) {
            localPeak.set(stats.peak);
        }
        if (stats.nonZero > 0) {
            localNonZero.incrementAndGet();
        }
        offerLatest(localQueue, new PcmChunk(mono, sr, 1));
    }

    @Override
    public void onRemotePlayoutSamples(@NonNull byte[] pcm16, int sampleRate, int channelCount) {
        if (!recording.get() || pcm16.length == 0) {
            return;
        }
        int sr = sampleRate > 0 ? sampleRate : TARGET_SAMPLE_RATE;
        int ch = Math.max(1, channelCount);
        byte[] mono = toMonoPcm16(pcm16, ch);
        Stats stats = analyzePcm16(mono);
        remoteCallbacks.incrementAndGet();
        remoteSampleCount.addAndGet(stats.samples);
        remoteAbsSum.addAndGet(stats.absSum);
        lastRemoteSampleRate = sr;
        lastRemoteChannels = ch;
        lastRemoteBufferBytes = pcm16.length;
        if (stats.peak > remotePeak.get()) {
            remotePeak.set(stats.peak);
        }
        if (stats.nonZero > 0) {
            remoteNonZero.incrementAndGet();
        }
        offerLatest(remoteQueue, new PcmChunk(mono, sr, 1));
    }

    private void mixLoop() {
        Process.setThreadPriority(Process.THREAD_PRIORITY_AUDIO);
        short[] localCarry = new short[0];
        short[] remoteCarry = new short[0];

        while (recording.get() || !localQueue.isEmpty() || !remoteQueue.isEmpty()) {
            try {
                PcmChunk localChunk = localQueue.poll(20, TimeUnit.MILLISECONDS);
                PcmChunk remoteChunk = remoteQueue.poll(20, TimeUnit.MILLISECONDS);

                if (localChunk == null && remoteChunk == null) {
                    if (!recording.get()) {
                        break;
                    }
                    continue;
                }

                short[] localSamples =
                        localChunk != null
                                ? concat(
                                        localCarry,
                                        resampleTo(
                                                pcm16ToShorts(localChunk.data),
                                                localChunk.sampleRate,
                                                outputSampleRate))
                                : localCarry;
                short[] remoteSamples =
                        remoteChunk != null
                                ? concat(
                                        remoteCarry,
                                        resampleTo(
                                                pcm16ToShorts(remoteChunk.data),
                                                remoteChunk.sampleRate,
                                                outputSampleRate))
                                : remoteCarry;

                int frames = Math.min(
                        localSamples.length > 0 ? localSamples.length : remoteSamples.length,
                        remoteSamples.length > 0 ? remoteSamples.length : localSamples.length);
                if (frames <= 0) {
                    localCarry = localSamples;
                    remoteCarry = remoteSamples;
                    continue;
                }

                byte[] mixed = new byte[frames * 2];
                for (int i = 0; i < frames; i++) {
                    int local = i < localSamples.length ? localSamples[i] : 0;
                    int remote = i < remoteSamples.length ? remoteSamples[i] : 0;
                    int sum = local + remote;
                    if (sum > Short.MAX_VALUE) {
                        sum = Short.MAX_VALUE;
                    } else if (sum < Short.MIN_VALUE) {
                        sum = Short.MIN_VALUE;
                    }
                    mixed[i * 2] = (byte) (sum & 0xff);
                    mixed[i * 2 + 1] = (byte) ((sum >> 8) & 0xff);
                }

                localCarry =
                        localSamples.length > frames
                                ? slice(localSamples, frames, localSamples.length - frames)
                                : new short[0];
                remoteCarry =
                        remoteSamples.length > frames
                                ? slice(remoteSamples, frames, remoteSamples.length - frames)
                                : new short[0];

                writePcm(mixed);
                mixedBuffers.incrementAndGet();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } catch (IOException e) {
                Log.e(TAG, "mix write failed", e);
                break;
            }
        }
    }

    private synchronized void writePcm(byte[] pcm) throws IOException {
        if (wavOut == null || pcm.length == 0) {
            return;
        }
        wavOut.write(pcm);
        pcmBytesWritten += pcm.length;
    }

    private void stopInternal() {
        recording.set(false);
        CallRecordingAudioTap.getInstance().stopCapturing();
        CallRecordingAudioTap.getInstance().setListener(null);

        joinQuietly(mixThread);
        mixThread = null;
        localQueue.clear();
        remoteQueue.clear();

        try {
            if (wavOut != null) {
                wavOut.flush();
                wavOut.close();
                wavOut = null;
            }
            if (outputFile != null && outputFile.exists()) {
                patchWavHeader(outputFile, pcmBytesWritten, outputSampleRate, CHANNEL_COUNT);
            }
        } catch (IOException e) {
            Log.e(TAG, "finalize wav failed", e);
        }
    }

    private void resetDiagnostics() {
        localCallbacks.set(0);
        remoteCallbacks.set(0);
        localNonZero.set(0);
        remoteNonZero.set(0);
        mixedBuffers.set(0);
        localPeak.set(0);
        remotePeak.set(0);
        localAbsSum.set(0);
        remoteAbsSum.set(0);
        localSampleCount.set(0);
        remoteSampleCount.set(0);
        lastRemoteSampleRate = 0;
        lastRemoteChannels = 0;
        lastRemoteBufferBytes = 0;
    }

    private static String formatRms(long absSum, long samples) {
        if (samples <= 0) {
            return "0";
        }
        return String.format("%.1f", absSum / (double) samples);
    }

    private static void offerLatest(ArrayBlockingQueue<PcmChunk> queue, PcmChunk data) {
        if (!queue.offer(data)) {
            queue.poll();
            queue.offer(data);
        }
    }

    private static byte[] toMonoPcm16(byte[] interleaved, int channelCount) {
        if (channelCount <= 1) {
            return interleaved;
        }
        int frames = interleaved.length / (2 * channelCount);
        byte[] mono = new byte[frames * 2];
        for (int i = 0; i < frames; i++) {
            int src = i * channelCount * 2;
            mono[i * 2] = interleaved[src];
            mono[i * 2 + 1] = interleaved[src + 1];
        }
        return mono;
    }

    private static short[] pcm16ToShorts(byte[] pcm) {
        int n = pcm.length / 2;
        short[] out = new short[n];
        for (int i = 0; i < n; i++) {
            out[i] = (short) ((pcm[i * 2] & 0xff) | (pcm[i * 2 + 1] << 8));
        }
        return out;
    }

    private static short[] resampleTo(short[] input, int srcRate, int dstRate) {
        if (input.length == 0 || srcRate <= 0 || dstRate <= 0 || srcRate == dstRate) {
            return input;
        }
        int outLen = (int) ((long) input.length * dstRate / srcRate);
        if (outLen <= 0) {
            return new short[0];
        }
        short[] out = new short[outLen];
        for (int i = 0; i < outLen; i++) {
            double srcIndex = (double) i * srcRate / dstRate;
            int i0 = (int) srcIndex;
            int i1 = Math.min(i0 + 1, input.length - 1);
            double frac = srcIndex - i0;
            out[i] = (short) Math.round(input[i0] * (1.0 - frac) + input[i1] * frac);
        }
        return out;
    }

    private static short[] concat(short[] a, short[] b) {
        if (a.length == 0) {
            return b;
        }
        if (b.length == 0) {
            return a;
        }
        short[] out = new short[a.length + b.length];
        System.arraycopy(a, 0, out, 0, a.length);
        System.arraycopy(b, 0, out, a.length, b.length);
        return out;
    }

    private static short[] slice(short[] src, int offset, int length) {
        short[] out = new short[length];
        System.arraycopy(src, offset, out, 0, length);
        return out;
    }

    private static Stats analyzePcm16(byte[] pcm) {
        int samples = pcm.length / 2;
        long absSum = 0;
        int peak = 0;
        int nonZero = 0;
        for (int i = 0; i < samples; i++) {
            int sample = (short) ((pcm[i * 2] & 0xff) | (pcm[i * 2 + 1] << 8));
            int abs = Math.abs(sample);
            absSum += abs;
            if (abs > peak) {
                peak = abs;
            }
            if (sample != 0) {
                nonZero++;
            }
        }
        return new Stats(samples, absSum, peak, nonZero);
    }

    private static void writeWavHeaderPlaceholder(FileOutputStream out) throws IOException {
        out.write(new byte[44]);
    }

    private static void patchWavHeader(File file, long pcmBytes, int sampleRate, int channels)
            throws IOException {
        long totalDataLen = pcmBytes + 36;
        long byteRate = (long) sampleRate * channels * 16 / 8;
        ByteBuffer header = ByteBuffer.allocate(44).order(ByteOrder.LITTLE_ENDIAN);
        header.put("RIFF".getBytes());
        header.putInt((int) totalDataLen);
        header.put("WAVE".getBytes());
        header.put("fmt ".getBytes());
        header.putInt(16);
        header.putShort((short) 1);
        header.putShort((short) channels);
        header.putInt(sampleRate);
        header.putInt((int) byteRate);
        header.putShort((short) (channels * 16 / 8));
        header.putShort((short) 16);
        header.put("data".getBytes());
        header.putInt((int) pcmBytes);

        try (RandomAccessFile raf = new RandomAccessFile(file, "rw")) {
            raf.seek(0);
            raf.write(header.array());
        }
    }

    private static void joinQuietly(@Nullable Thread thread) {
        if (thread == null) {
            return;
        }
        try {
            thread.join(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private static final class PcmChunk {
        final byte[] data;
        final int sampleRate;

        PcmChunk(byte[] data, int sampleRate, int ignoredChannels) {
            this.data = data;
            this.sampleRate = sampleRate;
        }
    }

    private static final class Stats {
        final int samples;
        final long absSum;
        final int peak;
        final int nonZero;

        Stats(int samples, long absSum, int peak, int nonZero) {
            this.samples = samples;
            this.absSum = absSum;
            this.peak = peak;
            this.nonZero = nonZero;
        }
    }
}
