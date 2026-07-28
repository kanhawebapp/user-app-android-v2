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
  isConnecting: boolean;
  isConnected: boolean;

  // RTC
  rtcToken: RTCToken | null;
  localUid: number | null;
  remoteUid: number | null;

  // Call Timer
  callDuration: number;
  callStartTime: string | null;
  callDurationRemaining: number;

  // Actions
  initiateCall: (astrologerId: string, callType: 'voice') => void;
  setCallSession: (session: CallSession) => void;
  setCallStatus: (status: CallStatus) => void;
  setRtcToken: (token: RTCToken) => void;

  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setSpeakerOn: (speakerOn: boolean) => void;
  toggleSpeaker: () => void;

  setConnecting: (connecting: boolean) => void;
  setConnected: (connected: boolean) => void;
  setLocalUid: (uid: number | null) => void;
  setRemoteUid: (uid: number | null) => void;

  updateDuration: (duration: number) => void;
  incrementDuration: () => void;

  setCallDurationRemaining: (duration: number) => void;
  resetCallTimer: () => void;

  endCall: () => void;
  resetCall: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  // Initial state
  currentCall: null,
  callStatus: 'initiated',
  isMuted: false,
  isSpeakerOn: false,
  isConnecting: false,
  isConnected: false,
  rtcToken: null,
  localUid: null,
  remoteUid: null,
  callDuration: 0,
  callStartTime: null,
  callDurationRemaining: 0,

  initiateCall: astrologerId =>
    set({
      currentCall: {
        id: '',
        userId: '',
        astrologerId,
        type: 'voice',
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
      callDurationRemaining: 0,
    }),

  setCallSession: session => set({currentCall: session}),
  setCallStatus: callStatus => set({callStatus}),
  setRtcToken: rtcToken => set({rtcToken}),

  setMuted: isMuted => set({isMuted}),
  toggleMute: () => set(state => ({isMuted: !state.isMuted})),
  setSpeakerOn: isSpeakerOn => set({isSpeakerOn}),
  toggleSpeaker: () => set(state => ({isSpeakerOn: !state.isSpeakerOn})),

  setConnecting: isConnecting => set({isConnecting}),
  setConnected: isConnected => set({isConnected, isConnecting: false}),
  setLocalUid: localUid => set({localUid}),
  setRemoteUid: remoteUid => set({remoteUid}),

  updateDuration: callDuration => set({callDuration}),
  incrementDuration: () =>
    set(state => ({callDuration: state.callDuration + 1})),

  setCallDurationRemaining: callDurationRemaining =>
    set({callDurationRemaining}),

  resetCallTimer: () => set({callDurationRemaining: 0}),

  endCall: () =>
    set(state => ({
      callStatus: 'ended',
      currentCall: state.currentCall
        ? {
            ...state.currentCall,
            status: 'ended',
            endTime: new Date().toISOString(),
            totalDuration:
              state.callDuration || state.callDurationRemaining || 0,
          }
        : null,
      isConnected: false,
      callDurationRemaining: 0,
    })),

  resetCall: () =>
    set({
      currentCall: null,
      callStatus: 'initiated',
      isMuted: false,
      isSpeakerOn: false,
      isConnecting: false,
      isConnected: false,
      rtcToken: null,
      localUid: null,
      remoteUid: null,
      callDuration: 0,
      callStartTime: null,
      callDurationRemaining: 0,
  }),
}));
