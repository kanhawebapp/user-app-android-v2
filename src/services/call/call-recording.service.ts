import {NativeModules, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import type {MediaStream} from 'react-native-webrtc';
import {uploadCallRecording} from '../api/upload/upload.api';
import {webRTCService} from './webrtc.service';

// Lazy-load so a missing native binary does not crash module evaluation.
const audioRecorderPkg = require('react-native-audio-recorder-player');
const AudioRecorderPlayerCtor =
  audioRecorderPkg.default ?? audioRecorderPkg;
const {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AVModeIOSOption,
  OutputFormatAndroidType,
} = audioRecorderPkg;

type NativeMixerModule = {
  isAvailable?: () => Promise<boolean>;
  startRecorder: (path: string) => Promise<string>;
  stopRecorder: () => Promise<string | null>;
};

const CallAudioMixerRecorder: NativeMixerModule | undefined =
  NativeModules.CallAudioMixerRecorder;

export type CallRecordingUploadMeta = {
  roomId: string;
  astroId: string;
  astroName: string;
  userId: string;
  callType?: string;
};

type FinalizedRecording = {
  uri: string;
  name: string;
  type: string;
  durationSec: number;
};

type StreamPair = {
  local?: MediaStream | null;
  remote?: MediaStream | null;
};

/**
 * Two-way call recording.
 *
 * Android native mixer combines:
 *   1) Local WebRTC mic PCM (SamplesReadyCallback)
 *   2) Remote decoded playout PCM (TeeingAudioTrack — AudioTrackSink is absent
 *      in org.jitsi:webrtc:124.0.0)
 *
 * iOS falls back to audio-recorder-player in measurement mode after remote audio
 * is available.
 */
class CallRecordingService {
  private isRecordingRef = false;
  private callStartTimeRef = 0;
  private recordingInitializedRef = false;
  private recordingUploadStartedRef = false;
  private recordingStoppedRef = false;

  private recordingPath: string | null = null;
  private usingNativeMixer = false;
  private audioRecorderPlayer: InstanceType<
    typeof AudioRecorderPlayerCtor
  > | null = null;
  private stopPromise: Promise<FinalizedRecording | null> | null = null;
  private startWaitAbort = false;

  private assertFallbackRecorderLinked(): void {
    if (!NativeModules.RNAudioRecorderPlayer) {
      throw new Error(
        'RNAudioRecorderPlayer native module is null. ' +
          'Rebuild the app after installing react-native-audio-recorder-player.',
      );
    }
  }

  resetForNewCall(): void {
    this.startWaitAbort = true;
    this.clearRecordingRefs();
    this.recordingUploadStartedRef = false;
    this.recordingStoppedRef = false;
    this.recordingInitializedRef = false;
    this.isRecordingRef = false;
    this.callStartTimeRef = 0;
    this.recordingPath = null;
    this.stopPromise = null;
    this.usingNativeMixer = false;
  }

  async startRecording(
    localStream?: MediaStream | null,
    remoteStream?: MediaStream | null,
  ): Promise<void> {
    if (this.recordingInitializedRef || this.isRecordingRef) {
      console.log(
        '[CallRecording] start skipped — already initialized/recording',
      );
      return;
    }

    this.recordingInitializedRef = true;
    this.recordingStoppedRef = false;
    this.recordingUploadStartedRef = false;
    this.startWaitAbort = false;
    this.callStartTimeRef = Date.now();

    try {
      const streams = await this.waitForRemoteAudio({
        local: localStream,
        remote: remoteStream,
      });

      if (this.startWaitAbort || this.recordingStoppedRef) {
        console.log('[CallRecording] start aborted while waiting for remote');
        this.recordingInitializedRef = false;
        return;
      }

      // Keep speaker on so remote WebRTC audio is audible to the ambient mic path.
      try {
        webRTCService.toggleSpeaker(true);
      } catch (error) {
        console.log('[CallRecording] toggleSpeaker failed:', error);
      }

      const startedNative = await this.tryStartNativeMixer();
      if (!startedNative) {
        await this.startFallbackRecorder();
      }

      this.isRecordingRef = true;
      console.log('[CallRecording] Recording started', {
        mode: this.usingNativeMixer ? 'native-mixer' : 'fallback-recorder',
        localTracks: streams.local?.getAudioTracks?.()?.length ?? 0,
        remoteTracks: streams.remote?.getAudioTracks?.()?.length ?? 0,
      });
    } catch (error) {
      console.log('[CallRecording] start failed:', error);
      this.isRecordingRef = false;
      this.recordingInitializedRef = false;
      this.clearRecordingRefs();
    }
  }

  /**
   * Stop once, finalize the file, then upload once.
   * Safe to call from both call_ended_by_astrologer and handleEndCall/endCall.
   */
  async stopAndUpload(meta: CallRecordingUploadMeta): Promise<void> {
    this.startWaitAbort = true;
    const finalized = await this.stopRecording();

    if (!finalized) {
      console.log('[CallRecording] No finalized recording to upload');
      this.clearRecordingRefs();
      return;
    }

    if (this.recordingUploadStartedRef) {
      console.log('[CallRecording] Upload already started — skipping duplicate');
      return;
    }
    this.recordingUploadStartedRef = true;

    try {
      if (
        !meta.roomId ||
        !meta.astroId ||
        !meta.userId ||
        finalized.durationSec <= 0
      ) {
        console.log(
          '[CallRecording] Missing upload meta or empty duration — skip upload',
          {
            roomId: meta.roomId,
            astroId: meta.astroId,
            userId: meta.userId,
            duration: finalized.durationSec,
          },
        );
        return;
      }

      console.log('[CallRecording] Upload started');

      const result = await uploadCallRecording({
        recording: {
          uri: finalized.uri,
          name: finalized.name,
          type: finalized.type,
        },
        roomId: meta.roomId,
        astroId: meta.astroId,
        astroName: meta.astroName || 'Astrologer',
        userId: meta.userId,
        duration: finalized.durationSec,
        callType: meta.callType || 'audio',
      });

      if (result?.success) {
        console.log('[CallRecording] Upload successful', {
          recordingId: result.recording?.id,
          recordingUrl: result.recording?.recordingUrl,
        });
      } else {
        console.error('[CallRecording] Upload failed:', result?.message);
      }
    } catch (error) {
      console.log(
        '[CallRecording] Upload failed (call cleanup continues):',
        error,
      );
    } finally {
      // Clear in-memory refs only — do not delete the local file here.
      // Never stop/disable remote WebRTC tracks from this service.
      this.clearRecordingRefs();
    }
  }

  async stopRecording(): Promise<FinalizedRecording | null> {
    if (this.stopPromise) {
      return this.stopPromise;
    }

    if (this.recordingStoppedRef && !this.isRecordingRef) {
      return null;
    }

    this.recordingStoppedRef = true;
    this.stopPromise = this.finalizeRecording();
    try {
      return await this.stopPromise;
    } finally {
      this.stopPromise = null;
    }
  }

  private async waitForRemoteAudio(
    initial: StreamPair,
    timeoutMs = 15000,
  ): Promise<{local: MediaStream | null; remote: MediaStream | null}> {
    const startedAt = Date.now();

    while (!this.startWaitAbort && Date.now() - startedAt < timeoutMs) {
      const local =
        webRTCService.getLocalMediaStream() ||
        initial.local ||
        null;
      const remote =
        webRTCService.getRemoteMediaStream() ||
        initial.remote ||
        null;

      const remoteTracks = remote?.getAudioTracks?.() ?? [];
      const liveRemote = remoteTracks.some(
        (track: any) =>
          track &&
          track.readyState !== 'ended' &&
          track.enabled !== false,
      );

      if (liveRemote) {
        console.log('[CallRecording] Remote audio ready');
        return {local, remote};
      }

      console.log('[CallRecording] Waiting for remote audio track...');
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    const local =
      webRTCService.getLocalMediaStream() || initial.local || null;
    const remote =
      webRTCService.getRemoteMediaStream() || initial.remote || null;

    if ((remote?.getAudioTracks?.()?.length ?? 0) === 0) {
      throw new Error(
        'Remote audio track not available — refusing mic-only recording',
      );
    }

    return {local, remote};
  }

  private async tryStartNativeMixer(): Promise<boolean> {
    if (Platform.OS !== 'android' || !CallAudioMixerRecorder?.startRecorder) {
      return false;
    }

    try {
      const available = CallAudioMixerRecorder.isAvailable
        ? await CallAudioMixerRecorder.isAvailable()
        : true;
      if (!available) {
        return false;
      }

      const dirs = ReactNativeBlobUtil.fs.dirs;
      const requestedPath = `${dirs.CacheDir}/call_recording_${Date.now()}.wav`;
      const startedPath = await CallAudioMixerRecorder.startRecorder(requestedPath);
      // Keep the exact native path so upload uses the same file that was written.
      this.recordingPath = startedPath || requestedPath;
      this.usingNativeMixer = true;
      console.log('[CallRecording] Native two-way mixer started:', this.recordingPath);
      return true;
    } catch (error) {
      console.log('[CallRecording] Native mixer unavailable, falling back:', error);
      this.usingNativeMixer = false;
      this.recordingPath = null;
      return false;
    }
  }

  private async startFallbackRecorder(): Promise<void> {
    this.assertFallbackRecorderLinked();

    if (typeof AudioRecorderPlayerCtor !== 'function') {
      throw new Error('AudioRecorderPlayer constructor is unavailable');
    }

    const dirs = ReactNativeBlobUtil.fs.dirs;
    const ext = Platform.OS === 'ios' ? 'm4a' : 'mp4';
    const path = `${dirs.CacheDir}/call_recording_${Date.now()}.${ext}`;
    this.recordingPath = path;

    if (!this.audioRecorderPlayer) {
      this.audioRecorderPlayer = new AudioRecorderPlayerCtor();
    }

    if (!this.audioRecorderPlayer?.startRecorder) {
      throw new Error('AudioRecorderPlayer.startRecorder is unavailable');
    }

    // Avoid VOICE_COMMUNICATION — its AEC strips remote speaker audio from the recording.
    const iosAudioSet = {
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 1,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      AVModeIOS: AVModeIOSOption.measurement,
      AVSampleRateKeyIOS: 44100,
    };

    if (Platform.OS === 'ios') {
      await this.audioRecorderPlayer.startRecorder(path, iosAudioSet as any);
    } else {
      const androidSources = [
        AudioSourceAndroidType.UNPROCESSED,
        AudioSourceAndroidType.MIC,
        AudioSourceAndroidType.CAMCORDER,
        AudioSourceAndroidType.VOICE_RECOGNITION,
      ];
      let started = false;
      let lastError: unknown;
      for (const source of androidSources) {
        try {
          const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: source,
            OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
            AudioSamplingRateAndroid: 44100,
            AudioEncodingBitRateAndroid: 128000,
            AudioChannelsAndroid: 1,
          };
          await this.audioRecorderPlayer.startRecorder(path, audioSet as any);
          console.log('[CallRecording] Fallback recorder source:', source);
          started = true;
          break;
        } catch (error) {
          lastError = error;
          try {
            await this.audioRecorderPlayer.stopRecorder();
          } catch {
            // ignore
          }
        }
      }
      if (!started) {
        throw lastError || new Error('Unable to start fallback recorder');
      }
    }

    this.usingNativeMixer = false;
    console.log('[CallRecording] Fallback recorder started:', path);
  }

  private normalizeRecordingPath(uriOrPath: string): {
    path: string;
    uri: string;
  } {
    let path = (uriOrPath || '').trim();
    while (path.startsWith('file://')) {
      path = path.slice('file://'.length);
    }
    path = path.replace(/^\/+/, '/');
    if (!path.startsWith('/')) {
      path = `/${path}`;
    }
    return {path, uri: `file://${path}`};
  }

  private async finalizeRecording(): Promise<FinalizedRecording | null> {
    const durationSec = this.getRecordingDurationSec();

    try {
      console.log('[CallRecording] Recording stopped');

      if (!this.isRecordingRef && !this.recordingPath) {
        return null;
      }

      const rawPath = this.usingNativeMixer
        ? await this.stopNativeMixer()
        : await this.stopFallbackRecorder();
      this.isRecordingRef = false;

      if (!rawPath) {
        console.log('[CallRecording] Recorder returned empty path');
        return null;
      }

      const {path: normalizedPath, uri} = this.normalizeRecordingPath(rawPath);
      const exists = await ReactNativeBlobUtil.fs.exists(normalizedPath);
      if (!exists) {
        console.log('[CallRecording] Recording file missing after stop');
        return null;
      }

      const basename = normalizedPath.split('/').pop() || '';
      const isWav = normalizedPath.toLowerCase().endsWith('.wav');
      const ext = isWav
        ? 'wav'
        : basename.includes('.')
          ? basename.split('.').pop() || (Platform.OS === 'ios' ? 'm4a' : 'mp4')
          : Platform.OS === 'ios'
            ? 'm4a'
            : 'mp4';
      const type = isWav
        ? 'audio/wav'
        : Platform.OS === 'ios'
          ? 'audio/m4a'
          : 'audio/mp4';

      // Use the real on-disk basename — do not invent a new timestamped name.
      const finalized = {
        uri,
        name: basename || `call_recording.${ext}`,
        type,
        durationSec: Math.max(1, durationSec),
      };

      this.recordingPath = normalizedPath;

      console.log('[CallRecording] Recording file finalized', {
        name: finalized.name,
        type: finalized.type,
        durationSec: finalized.durationSec,
        uri: finalized.uri,
        path: normalizedPath,
        mode: this.usingNativeMixer ? 'native-mixer' : 'fallback-recorder',
      });

      return finalized;
    } catch (error) {
      console.log('[CallRecording] finalize failed:', error);
      this.isRecordingRef = false;
      return null;
    }
  }

  private async stopNativeMixer(): Promise<string | null> {
    if (!CallAudioMixerRecorder?.stopRecorder) {
      return this.recordingPath;
    }
    try {
      const result = await CallAudioMixerRecorder.stopRecorder();
      console.log('[CallRecording] Native mixer stopped:', result);
      return result || this.recordingPath;
    } catch (error) {
      console.log('[CallRecording] Native mixer stop failed:', error);
      return this.recordingPath;
    }
  }

  private async stopFallbackRecorder(): Promise<string | null> {
    if (!this.audioRecorderPlayer) {
      return this.recordingPath;
    }

    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      console.log('[CallRecording] Fallback recorder stopped:', result);
      return result || this.recordingPath;
    } catch (error) {
      console.log('[CallRecording] Fallback stop failed:', error);
      return this.recordingPath;
    }
  }

  private getRecordingDurationSec(): number {
    if (!this.callStartTimeRef) {
      return 0;
    }
    return Math.max(
      0,
      Math.round((Date.now() - this.callStartTimeRef) / 1000),
    );
  }

  private clearRecordingRefs(): void {
    this.recordingPath = null;
    this.isRecordingRef = false;
    this.usingNativeMixer = false;
  }
}

export const callRecordingService = new CallRecordingService();
