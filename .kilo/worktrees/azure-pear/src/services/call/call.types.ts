import {
  MediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';

export interface CallParticipant {
  id: string;
  name: string;
  image?: string;
}

export interface CallRequestData {
  callId: string;
  callerId: string;
  callerName: string;
  callerImage?: string;
  calleeId: string;
  room_id: string;
}

export interface OfferData {
  sdp: RTCSessionDescription;
  callId: string;
  callerId: string;
}

export interface AnswerData {
  sdp: RTCSessionDescription;
  callId: string;
}

export interface IceCandidateData {
  candidate: RTCIceCandidate;
  callId: string;
}

export interface CallState {
  callId: string | null;
  callerId: string | null;
  calleeId: string | null;
  roomId: string | null;
  participant: CallParticipant | null;
  status:
    | 'idle'
    | 'queue_checking'
    | 'queued'
    | 'calling'
    | 'ringing'
    | 'connecting'
    | 'connecting_webrtc'
    | 'creating_offer'
    | 'sending_offer'
    | 'waiting_answer'
    | 'creating_answer'
    | 'waiting_connection'
    | 'connected'
    | 'ended'
    | 'rejected';
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isSpeakerOn: boolean;
  callDuration: number;
  callDurationRemaining: number;
  error: string | null;
}

export interface CallConfig {
  iceServers: Array<{
    urls: string | string[];
    username?: string;
    credential?: string;
  }>;
  enableLogging?: boolean;
  iceCandidatePoolSize?: number;
  bundlePolicy?: 'balanced' | 'max-compat' | 'max-bundle';
  rtcpMuxPolicy?: 'negotiate' | 'require';
}

export const DEFAULT_CALL_CONFIG: CallConfig = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
  ],
  enableLogging: __DEV__,
};

export const TURN_CONFIG: CallConfig = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'your-username',
      credential: 'your-credential',
    },
  ],
  enableLogging: __DEV__,
};
