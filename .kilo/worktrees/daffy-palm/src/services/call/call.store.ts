import {create} from 'zustand';
import {CallState, CallParticipant} from './call.types';
import {MediaStream} from 'react-native-webrtc';

interface CallStore extends CallState {
  setCallId: (id: string | null) => void;
  setParticipant: (participant: CallParticipant | null) => void;
  setStatus: (status: CallState['status']) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setMuted: (muted: boolean) => void;
  setSpeakerOn: (on: boolean) => void;
  setCallDuration: (duration: number) => void;
  setError: (error: string | null) => void;
  setRoomId: (roomId: string | null) => void;
  reset: () => void;
}

const initialState: CallState = {
  callId: null,
  callerId: null,
  calleeId: null,
  roomId: null,
  participant: null,
  status: 'idle',
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isSpeakerOn: true,
  callDuration: 0,
  error: null,
};

export const useCallStore = create<CallStore>(set => ({
  ...initialState,

  setCallId: callId => set({callId}),
  setParticipant: participant => set({participant}),
  setStatus: status => set({status}),
  setLocalStream: localStream => set({localStream}),
  setRemoteStream: remoteStream => set({remoteStream}),
  setMuted: isMuted => set({isMuted}),
  setSpeakerOn: isSpeakerOn => set({isSpeakerOn}),
  setCallDuration: callDuration => set({callDuration}),
  setError: error => set({error}),
  setRoomId: roomId => set({roomId}),

  reset: () => set(initialState),
}));

export const selectCallStatus = (state: CallStore) => state.status;
export const selectLocalStream = (state: CallStore) => state.localStream;
export const selectRemoteStream = (state: CallStore) => state.remoteStream;
export const selectParticipant = (state: CallStore) => state.participant;
export const selectCallId = (state: CallStore) => state.callId;
