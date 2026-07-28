/**
 * Call Store - Zustand
 * Manages voice and video call state
 */

import {create} from 'zustand';
import type {CallSession, CallStatus, RTCToken} from '../types/global.types';

interface CallState {
  // Call State
  currentCall: CallSession | null;
  callStatus: CallStatus;
  isMuted: boolean;
  isSpeakerOn: boolean;
  isVideoEnabled: boolean;
  isConnecting: boolean;
  isConnected: boolean;

  // RTC
  rtcToken: RTCToken | null;
  localUid: number | null;
  remoteUid: number | null;

  // Call Timer
  callDuration: number;
  callStartTime: string | null;

  // Actions
  initiateCall: (astrologerId: string, callType: 'voice' | 'video') => void;
  setCallSession: (session: CallSession) => void;
  setCallStatus: (status: CallStatus) => void;
  setRtcToken: (token: RTCToken) => void;

  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setSpeakerOn: (speakerOn: boolean) => void;
  toggleSpeaker: () => void;
  setVideoEnabled: (enabled: boolean) => void;
  toggleVideo: () => void;

  setConnecting: (connecting: boolean) => void;
  setConnected: (connected: boolean) => void;
  setLocalUid: (uid: number | null) => void;
  setRemoteUid: (uid: number | null) => void;

  updateDuration: (duration: number) => void;
  incrementDuration: () => void;

  endCall: () => void;
  resetCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  // Initial state
  currentCall: null,
  callStatus: 'initiated',
  isMuted: false,
  isSpeakerOn: false,
  isVideoEnabled: true,
  isConnecting: false,
  isConnected: false,
  rtcToken: null,
  localUid: null,
  remoteUid: null,
  callDuration: 0,
  callStartTime: null,

  initiateCall: (astrologerId, callType) =>
    set({
      currentCall: {
        id: '',
        userId: '',
        astrologerId,
        type: callType,
        status: 'initiated',
        startTime: new Date().toISOString(),
        totalDuration: 0,
        perMinuteRate: 0,
        costPerSecond: 0,
        totalCost: 0,
        walletDeducted: 0,
        agoraChannelName: '',
        paymentStatus: 'pending',
        isRecorded: false,
      },
      callStatus: 'initiated',
      isConnecting: true,
      isConnected: false,
      callDuration: 0,
      callStartTime: new Date().toISOString(),
    }),

  setCallSession: session => set({currentCall: session}),
  setCallStatus: callStatus => set({callStatus}),
  setRtcToken: rtcToken => set({rtcToken}),

  setMuted: isMuted => set({isMuted}),
  toggleMute: () => set(state => ({isMuted: !state.isMuted})),
  setSpeakerOn: isSpeakerOn => set({isSpeakerOn}),
  toggleSpeaker: () => set(state => ({isSpeakerOn: !state.isSpeakerOn})),
  setVideoEnabled: isVideoEnabled => set({isVideoEnabled}),
  toggleVideo: () => set(state => ({isVideoEnabled: !state.isVideoEnabled})),

  setConnecting: isConnecting => set({isConnecting}),
  setConnected: isConnected => set({isConnected, isConnecting: false}),
  setLocalUid: localUid => set({localUid}),
  setRemoteUid: remoteUid => set({remoteUid}),

  updateDuration: callDuration => set({callDuration}),
  incrementDuration: () =>
    set(state => ({callDuration: state.callDuration + 1})),

  endCall: () =>
    set(state => ({
      callStatus: 'ended',
      currentCall: state.currentCall
        ? {
            ...state.currentCall,
            status: 'ended',
            endTime: new Date().toISOString(),
            totalDuration: state.callDuration,
          }
        : null,
      isConnected: false,
    })),

  resetCall: () =>
    set({
      currentCall: null,
      callStatus: 'initiated',
      isMuted: false,
      isSpeakerOn: false,
      isVideoEnabled: true,
      isConnecting: false,
      isConnected: false,
      rtcToken: null,
      localUid: null,
      remoteUid: null,
      callDuration: 0,
      callStartTime: null,
    }),
}));

export default useCallStore;
