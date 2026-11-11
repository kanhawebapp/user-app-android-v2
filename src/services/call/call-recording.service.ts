import {NativeModules, Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Buffer} from 'buffer';
import type {MediaStream} from 'react-native-webrtc';
import {uploadCallRecording} from '../api/upload/upload.api';

// Lazy-load so a missing native binary does not crash module evaluation.
const audioRecorderPkg = require('react-native-audio-recorder-player');
const AudioRecorderPlayerCtor =
  audioRecorderPkg.default ?? audioRecorderPkg;
const {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  OutputFormatAndroidType,
} = audioRecorderPkg;

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

const NativeMediaRecorder: any = (globalThis as any).MediaRecorder;

/**
 * Call recording lifecycle adapted from the MediaRecorder reference flow.
 *
 * react-native-webrtc does not implement browser MediaRecorder, so on native
 * we record via react-native-audio-recorder-player while the call audio session
 * is active (speaker defaults on, so remote audio is typically captured too).
 * If MediaRecorder is ever available, the same start/stop/upload guards apply.
 */
class CallRecordingService {
  private mediaRecorderRef: any = null;
  private recordedChunksRef: any[] = [];
  private isRecordingRef = false;
  private callStartTimeRef = 0;
  private recordingInitializedRef = false;
  private combinedStreamRef: MediaStream | null = null;
  private recordingUploadStartedRef = false;
  private recordingStoppedRef = false;

  private recordingPath: string | null = null;
  private audioRecorderPlayer: InstanceType<
    typeof AudioRecorderPlayerCtor
  > | null = null;
  private stopPromise: Promise<FinalizedRecording | null> | null = null;

  private assertNativeModuleLinked(): void {
    if (!NativeModules.RNAudioRecorderPlayer) {
      throw new Error(
        'RNAudioRecorderPlayer native module is null. ' +
          'Rebuild the app after installing react-native-audio-recorder-player ' +
          '(Android: re-run react-native run-android; iOS: pod install && rebuild). ' +
          'Metro reload alone is not enough.',
      );
    }
  }

  resetForNewCall(): void {
    this.clearRecordingRefs();
    this.recordingUploadStartedRef = false;
    this.recordingStoppedRef = false;
    this.recordingInitializedRef = false;
    this.isRecordingRef = false;
    this.callStartTimeRef = 0;
    this.recordedChunksRef = [];
    this.combinedStreamRef = null;
    this.mediaRecorderRef = null;
    this.recordingPath = null;
    this.stopPromise = null;
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
    this.callStartTimeRef = Date.now();
    this.recordedChunksRef = [];

    try {
      if (typeof NativeMediaRecorder === 'function') {
        await this.startMediaRecorder(localStream, remoteStream);
        console.log('[CallRecording] Recording started');
        return;
      }

      await this.startNativeRecorder();
      console.log('[CallRecording] Recording started');
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
        console.error(
          '[CallRecording] Upload failed:',
          result?.message,
        );
      }
    } catch (error) {
      console.log(
        '[CallRecording] Upload failed (call cleanup continues):',
        error,
      );
    } finally {
      // Clear in-memory refs only — do not delete the local file here.
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

      if (this.mediaRecorderRef) {
        const blob = await this.stopMediaRecorder();
        if (!blob || blob.size === 0) {
          console.log('[CallRecording] Empty MediaRecorder chunks');
          this.isRecordingRef = false;
          return null;
        }

        const file = await this.persistBlobToCache(blob);
        this.isRecordingRef = false;
        console.log('[CallRecording] Recording file finalized', {
          name: file.name,
          type: file.type,
          durationSec: Math.max(1, durationSec),
        });
        return {
          ...file,
          durationSec: Math.max(1, durationSec),
        };
      }

      if (!this.isRecordingRef && !this.recordingPath) {
        return null;
      }

      const rawPath = await this.stopNativeRecorder();
      this.isRecordingRef = false;

      if (!rawPath) {
        console.log('[CallRecording] Native recorder returned empty path');
        return null;
      }

      const {path: normalizedPath, uri} = this.normalizeRecordingPath(rawPath);
      const exists = await ReactNativeBlobUtil.fs.exists(normalizedPath);
      if (!exists) {
        console.log('[CallRecording] Recording file missing after stop');
        return null;
      }

      const ext = Platform.OS === 'ios' ? 'm4a' : 'mp4';
      const finalized = {
        uri,
        name: `call_recording_${Date.now()}.${ext}`,
        type: Platform.OS === 'ios' ? 'audio/m4a' : 'audio/mp4',
        durationSec: Math.max(1, durationSec),
      };

      console.log('[CallRecording] Recording file finalized', {
        name: finalized.name,
        type: finalized.type,
        durationSec: finalized.durationSec,
        uri: finalized.uri,
      });

      return finalized;
    } catch (error) {
      console.log('[CallRecording] finalize failed:', error);
      this.isRecordingRef = false;
      return null;
    }
  }

  private async startMediaRecorder(
    localStream?: MediaStream | null,
    remoteStream?: MediaStream | null,
  ): Promise<void> {
    const tracks: any[] = [];

    localStream?.getAudioTracks?.().forEach((track: any) => {
      if (track) {
        tracks.push(track);
      }
    });
    remoteStream?.getAudioTracks?.().forEach((track: any) => {
      if (track) {
        tracks.push(track);
      }
    });

    if (tracks.length === 0) {
      throw new Error('No audio tracks available for MediaRecorder');
    }

    const CombinedStreamCtor =
      (globalThis as any).MediaStream ||
      // Fallback: reuse local stream container if constructor missing
      null;

    let combined: any = localStream || remoteStream;
    if (CombinedStreamCtor) {
      try {
        combined = new CombinedStreamCtor(tracks);
      } catch {
        combined = localStream || remoteStream;
      }
    }

    this.combinedStreamRef = combined;

    const isTypeSupported = NativeMediaRecorder.isTypeSupported?.bind(
      NativeMediaRecorder,
    );
    const mimeType = isTypeSupported?.('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : isTypeSupported?.('audio/mp4')
        ? 'audio/mp4'
        : '';

    const recorder = mimeType
      ? new NativeMediaRecorder(combined, {mimeType})
      : new NativeMediaRecorder(combined);

    this.recordedChunksRef = [];
    recorder.ondataavailable = (event: any) => {
      if (event?.data && event.data.size > 0) {
        this.recordedChunksRef.push(event.data);
      }
    };

    this.mediaRecorderRef = recorder;
    recorder.start(1000);
    this.isRecordingRef = true;
    console.log('[CallRecording] MediaRecorder started');
  }

  private stopMediaRecorder(): Promise<any | null> {
    return new Promise(resolve => {
      const recorder = this.mediaRecorderRef;
      if (!recorder) {
        resolve(null);
        return;
      }

      const finish = () => {
        try {
          if (this.recordedChunksRef.length === 0) {
            resolve(null);
            return;
          }
          const type = recorder.mimeType || 'audio/webm';
          const BlobCtor = (globalThis as any).Blob;
          if (!BlobCtor) {
            resolve(null);
            return;
          }
          resolve(new BlobCtor(this.recordedChunksRef, {type}));
        } catch (error) {
          console.log(
            '[CallRecording] MediaRecorder blob build failed:',
            error,
          );
          resolve(null);
        }
      };

      recorder.onstop = finish;

      try {
        if (recorder.state !== 'inactive') {
          recorder.requestData?.();
          recorder.stop();
        } else {
          finish();
        }
      } catch (error) {
        console.log('[CallRecording] MediaRecorder stop failed:', error);
        finish();
      }
    });
  }

  private async startNativeRecorder(): Promise<void> {
    this.assertNativeModuleLinked();

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

    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.VOICE_COMMUNICATION,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 1,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
      OutputFormatAndroid: OutputFormatAndroidType.MPEG_4,
    };

    await this.audioRecorderPlayer.startRecorder(path, audioSet as any);
    this.isRecordingRef = true;
    console.log('[CallRecording] Native recorder started:', path);
  }

  private async stopNativeRecorder(): Promise<string | null> {
    if (!this.audioRecorderPlayer) {
      return this.recordingPath;
    }

    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      console.log('[CallRecording] Native recorder stopped:', result);
      return result || this.recordingPath;
    } catch (error) {
      console.log('[CallRecording] Native stop failed:', error);
      return this.recordingPath;
    }
  }

  private async persistBlobToCache(blob: any): Promise<{
    uri: string;
    name: string;
    type: string;
  }> {
    const type = blob.type || 'audio/webm';
    const ext = type.includes('mp4') || type.includes('m4a') ? 'm4a' : 'webm';
    const name = `call_recording_${Date.now()}.${ext}`;
    const path = `${ReactNativeBlobUtil.fs.dirs.CacheDir}/${name}`;

    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    await ReactNativeBlobUtil.fs.writeFile(path, base64, 'base64');

    return {
      uri: path.startsWith('file://') ? path : `file://${path}`,
      name,
      type,
    };
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
    try {
      if (this.mediaRecorderRef && this.mediaRecorderRef.state !== 'inactive') {
        try {
          this.mediaRecorderRef.stop();
        } catch {
          // already stopped
        }
      }
    } catch {
      // ignore
    }

    this.mediaRecorderRef = null;
    this.recordedChunksRef = [];
    this.combinedStreamRef = null;
    this.recordingPath = null;
    this.isRecordingRef = false;
  }
}

export const callRecordingService = new CallRecordingService();
