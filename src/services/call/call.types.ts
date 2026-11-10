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
    | 'waiting'
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


const ICE_SERVERS = [
  {
    urls: 'stun:162.214.102.56:3478',
  },
  {
    urls: 'turn:162.214.102.56:3478?transport=udp',
    username: 'turnuser',
    credential: 'Shiva@2025#',
  },
];
export const DEFAULT_CALL_CONFIG: CallConfig = {
  iceServers: ICE_SERVERS,
  enableLogging: __DEV__,
};

export const TURN_CONFIG: CallConfig = {
  iceServers: ICE_SERVERS,
  enableLogging: __DEV__,
};
