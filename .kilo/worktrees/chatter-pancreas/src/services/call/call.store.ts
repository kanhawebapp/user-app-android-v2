import { create } from 'zustand';
import { CallState, CallParticipant } from './call.types';
import { MediaStream } from 'react-native-webrtc';

interface CallStore extends CallState {
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
  reset: () => void;
  safeSetStatus: (status: CallState['status'], source?: string) => void;
}

// Ordered statuses — index represents progression.
// Forward transitions (equal or higher index) are allowed.
// Backward transitions (lower index) are blocked UNLESS going to 'ended'.
const STATUS_ORDER: CallState['status'][] = [
  'idle',
  'queue_checking',
  'queued',
  'calling',
  'ringing',
  'connecting',
  'connecting_webrtc',
  'creating_offer',
  'sending_offer',
  'waiting_answer',
  'creating_answer',
  'waiting_connection',
  'connected',
  'ended',
  'rejected',
];

const STATUS_ORDER_MAP: Record<CallState['status'], number> = {};
STATUS_ORDER.forEach((s, i) => {
  STATUS_ORDER_MAP[s] = i;
});

/**
 * Returns true only if this is a stale regression that should be ignored.
 *
 * Allows indefinitely:   x → connected  (any forward / same)
 * Allows indefinitely:   any → ended    (always ok)
 * Blocks only:            connected → waiting_connection | connecting | calling
 * Blocks only:            waiting_connection → creating_offer | sending_offer
 *
 * Does NOT block:         ended → ended
 * Does NOT block:         rejected → ended
 */
const isStaleRegression = (
  currentStatus: CallState['status'],
  nextStatus: CallState['status'],
): boolean => {
  if (currentStatus === 'ended') return false; // allow all from terminal state

  if (nextStatus === 'ended') return false; // always allow transition to ended

  const currentOrder = STATUS_ORDER_MAP[currentStatus] ?? 0;
  const nextOrder = STATUS_ORDER_MAP[nextStatus] ?? 0;

  // Block only lower-order regressions while NOT in 'ended'
  if (nextOrder < currentOrder) return true;

  // Same order is a no-op — allow it without logging noise
  if (nextOrder === currentOrder) return false;

  // nextOrder > currentOrder — forward progress, always allowed
  return false;
};

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
  isSpeakerOn: false,
  callDuration: 0,
  callDurationRemaining: 0,
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
  setCallDurationRemaining: callDurationRemaining =>
    set({callDurationRemaining}),
  resetCallTimer: () => set({callDurationRemaining: 0}),
  setError: error => set({error}),
  setRoomId: roomId => set({roomId}),

  reset: () => set(initialState),

  safeSetStatus: (status, source = 'unknown') => {
    const currentStatus = useCallStore.getState().status;
    const nextStatus = status;

    // Allow end of call unconditionally (even from connected)
    const nextOrder = STATUS_ORDER_MAP[nextStatus] ?? 0;
    const currentOrder = STATUS_ORDER_MAP[currentStatus] ?? 0;

    if (nextStatus === 'ended') {
      console.log(
        '[STATUS ALLOWED]',
        currentStatus,
        '->',
        nextStatus,
        'source:',
        source,
      );
      set({ status: nextStatus });
      return;
    }

    const wouldBeRegression =
      nextOrder < currentOrder && currentStatus !== 'ended';

    if (wouldBeRegression) {
      console.log(
        '[STATUS BLOCKED] stale regression blocked',
        currentStatus,
        '->',
        nextStatus,
        'source:',
        source,
      );
      return;
    }

    console.log(
      '[STATUS ALLOWED]',
      currentStatus,
      '->',
      nextStatus,
      'source:',
      source,
    );
    set({ status: nextStatus });
  },
}));

export const selectCallStatus = (state: CallStore) => state.status;
export const selectLocalStream = (state: CallStore) => state.localStream;
export const selectRemoteStream = (state: CallStore) => state.remoteStream;
export const selectParticipant = (state: CallStore) => state.participant;
export const selectCallId = (state: CallStore) => state.callId;
