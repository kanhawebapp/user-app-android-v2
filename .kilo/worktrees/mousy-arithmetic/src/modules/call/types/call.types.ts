import {MediaStream} from 'react-native-webrtc';
import {RTCSessionDescriptionInit} from 'react-native-webrtc/lib/typescript/RTCSessionDescription';

export type CallType = 'voice' | 'video';

export type CallStatus =
  | 'initiated'
  | 'ringing'
  | 'connecting'
  | 'active'
  | 'on_hold'
  | 'ended'
  | 'failed'
  | 'no_answer'
  | 'busy';

export type SignalingEventType =
  | 'offer'
  | 'answer'
  | 'ice-candidate'
  | 'call-initiate'
  | 'call-accept'
  | 'call-reject'
  | 'call-end'
  | 'peer-disconnected'
  | 'peer-reconnected';

export interface SignalingMessage {
  type: SignalingEventType;
  roomId: string;
  senderId: string;
  targetId?: string;
  payload: RTCSessionDescriptionInit | any | Record<string, unknown>;
  timestamp: string;
}

export interface WebRTCConfig {
  iceServers: any[];
}

export interface CallParticipant {
  id: string;
  name: string;
  avatar?: string;
  isLocal: boolean;
}

export interface CallState {
  status: CallStatus;
  isMuted: boolean;
  isSpeakerOn: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  duration: number;
}

export interface IncomingCallData {
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  callType: CallType;
  roomId: string;
  timestamp: string;
}

export interface MediaConstraints {
  audio: boolean;
  video: any | boolean;
}

export const DEFAULT_MEDIA_CONSTRAINTS: MediaConstraints = {
  audio: true,
  video: {
    facingMode: 'user',
    width: {ideal: 1280},
    height: {ideal: 720},
  },
};

export const DEFAULT_VIDEO_CONSTRAINTS: any = {
  facingMode: 'user',
  width: {ideal: 1280},
  height: {ideal: 720},
};

export const DEFAULT_AUDIO_CONSTRAINTS: any = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};
