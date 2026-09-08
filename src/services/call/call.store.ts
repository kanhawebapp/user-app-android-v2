import {create} from 'zustand';
import {CallState, CallParticipant} from './call.types';
import {QueueData} from '../socket/socket.types';
import {MediaStream} from 'react-native-webrtc';

interface CallStore extends CallState {
  // Independent call-queue state (mirrors chatStore.queueData / queueTimeLeft)
  queueData: QueueData | null;
  queueTimeLeft: number;
  queueTimerRef: NodeJS.Timeout | null;
  shouldNavigateToCall: boolean;
  pendingCallCancelled: boolean;

  setCallId: (id: string | null) => void;
  setParticipant: (participant: CallParticipant | null) => void;
  setStatus: (status: CallState['status']) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setMuted: (muted: boolean) => void;
  setSpeakerOn: (on: boolean) => void;
  setCallDuration: (duration: number) => void;
  setCallDurationRemaining: (duration: number) => void;
  resetCallTimer: () => void;
  setError: (error: string | null) => void;
  setRoomId: (roomId: string | null) => void;

  setQueueData: (queueData: QueueData | null) => void;
  updateQueueData: (data: Partial<QueueData>) => void;
  clearQueue: () => void;
  startQueueTimer: (seconds: number) => void;
  stopQueueTimer: () => void;
  setShouldNavigateToCall: (value: boolean) => void;
  cancelPendingCallQueue: () => void;
  resetPendingCallCancelled: () => void;

  reset: () => void;
}

const initialState: CallState & {
  queueData: QueueData | null;
  queueTimeLeft: number;
  queueTimerRef: NodeJS.Timeout | null;
  shouldNavigateToCall: boolean;
  pendingCallCancelled: boolean;
} = {
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
  callDurationRemaining: 0,
  error: null,
  queueData: null,
  queueTimeLeft: 0,
  queueTimerRef: null,
  shouldNavigateToCall: false,
  pendingCallCancelled: false,
};

export const useCallStore = create<CallStore>((set, get) => ({
  ...initialState,

  setCallId: callId => set({callId}),
  setParticipant: participant => set({participant}),
  setStatus: status => set({status}),
  setLocalStream: localStream => set({localStream}),
  setRemoteStream: remoteStream => set({remoteStream}),
  setMuted: isMuted => set({isMuted}),
  setSpeakerOn: isSpeakerOn => set({isSpeakerOn}),
  setCallDuration: callDuration => set({callDuration}),
  setCallDurationRemaining: callDurationRemaining =>
    set({callDurationRemaining}),
  resetCallTimer: () => set({callDurationRemaining: 0}),
  setError: error => set({error}),
  setRoomId: roomId => set({roomId}),

  setQueueData: queueData => set({queueData}),
  updateQueueData: data =>
    set(state => ({
      queueData: state.queueData ? {...state.queueData, ...data} : null,
    })),
  clearQueue: () => set({queueData: null}),

  startQueueTimer: seconds => {
    const currentInterval = get().queueTimerRef;
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    if (!seconds || seconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const current = get().queueTimeLeft;
      if (current <= 1) {
        clearInterval(interval);
        set({queueTimeLeft: 0, queueTimerRef: null});
      } else {
        set({queueTimeLeft: current - 1});
      }
    }, 1000);

    set({queueTimeLeft: seconds, queueTimerRef: interval});
  },

  stopQueueTimer: () => {
    const currentInterval = get().queueTimerRef;
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    set({queueTimerRef: null, queueTimeLeft: 0});
  },

  setShouldNavigateToCall: shouldNavigateToCall => set({shouldNavigateToCall}),

  cancelPendingCallQueue: () => {
    const currentInterval = get().queueTimerRef;
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    set({
      pendingCallCancelled: true,
      queueData: null,
      queueTimeLeft: 0,
      queueTimerRef: null,
      shouldNavigateToCall: false,
      status: 'idle',
    });
  },

  resetPendingCallCancelled: () => set({pendingCallCancelled: false}),

  reset: () => {
    const currentInterval = get().queueTimerRef;
    if (currentInterval) {
      clearInterval(currentInterval);
    }
    set({...initialState});
  },
}));

export const selectCallStatus = (state: CallStore) => state.status;
export const selectLocalStream = (state: CallStore) => state.localStream;
export const selectRemoteStream = (state: CallStore) => state.remoteStream;
export const selectParticipant = (state: CallStore) => state.participant;
export const selectCallId = (state: CallStore) => state.callId;
export const selectCallQueueData = (state: CallStore) => state.queueData;
export const selectCallQueueTimeLeft = (state: CallStore) => state.queueTimeLeft;
