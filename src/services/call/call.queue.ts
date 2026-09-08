import {QueueData} from '../socket/socket.types';
import {useCallStore} from './call.store';

/**
 * Call-queue helpers mirroring chat's global SocketService queue lifecycle.
 * Kept separate from chatStore so chat/call queue state never overwrite each other.
 */

/** Sync mutex — equivalent to SocketService.chatAcceptedHandled for calls. */
let callReadyHandled = false;

export const resetCallReadyFlag = () => {
  callReadyHandled = false;
};

export const isCallReadyHandled = () => callReadyHandled;

export const isCallRequestPending = (): boolean => {
  const status = useCallStore.getState().status;
  return (
    status === 'waiting' ||
    status === 'queue_checking' ||
    status === 'queued'
  );
};

export const isCallSessionActive = (): boolean => {
  const status = useCallStore.getState().status;
  return (
    status === 'calling' ||
    status === 'ringing' ||
    status === 'connecting' ||
    status === 'connecting_webrtc' ||
    status === 'creating_offer' ||
    status === 'sending_offer' ||
    status === 'waiting_answer' ||
    status === 'creating_answer' ||
    status === 'waiting_connection' ||
    status === 'connected' ||
    status === 'ended' ||
    status === 'rejected'
  );
};

const normalizeQueueSnapshot = (
  data: any,
  fallbackRoomId?: string | null,
): QueueData => {
  const waitTime = Number(data?.waitTime ?? data?.estimatedWaitTime ?? 0);
  return {
    position: data?.position ?? 0,
    waitTime,
    estimatedWaitTime: waitTime,
    astrologerId: data?.astrologerId ?? '',
    astrologerName: data?.astrologerName ?? '',
    roomId: data?.roomId ?? data?.room_id ?? data?.roomid ?? fallbackRoomId ?? '',
    message: data?.message ?? '',
    type: data?.type ?? data?.data?.type ?? 'call',
  };
};

/**
 * Promote pending call → calling + navigate once.
 * Same role as chat acceptance transitioning waiting/queued → active.
 */
export const promoteCallToCalling = (reason: string): boolean => {
  if (callReadyHandled) {
    console.log(
      '[CallQueue] Call already promoted for this session, ignoring:',
      reason,
    );
    return false;
  }

  const callStore = useCallStore.getState();
  if (callStore.pendingCallCancelled) {
    console.warn('[CallQueue] Promote ignored — call was cancelled');
    return false;
  }

  if (!isCallRequestPending()) {
    console.warn('[CallQueue] Promote ignored — call not pending', {
      status: callStore.status,
      reason,
    });
    return false;
  }

  // Room must exist (authoritative pending request id).
  if (!callStore.roomId) {
    console.warn('[CallQueue] Promote ignored — no pending roomId');
    return false;
  }

  callReadyHandled = true;

  callStore.stopQueueTimer();
  callStore.clearQueue();
  callStore.setStatus('calling');
  callStore.setShouldNavigateToCall(true);

  console.log('[CallQueue] Promoted to calling:', {
    reason,
    roomId: callStore.roomId,
    callId: callStore.callId,
  });

  return true;
};

export const applyCallQueuePosition = (data: any): void => {
  if (!data || isCallSessionActive()) {
    return;
  }
  if (!isCallRequestPending()) {
    return;
  }

  const callStore = useCallStore.getState();
  if (callStore.pendingCallCancelled) {
    return;
  }

  const incomingRoomId =
    data?.roomId || data?.room_id || data?.roomid || null;
  if (
    incomingRoomId &&
    callStore.roomId &&
    String(incomingRoomId) !== String(callStore.roomId)
  ) {
    console.warn('[CallQueue] QUEUE_POSITION ignored — roomId mismatch', {
      incoming: incomingRoomId,
      current: callStore.roomId,
    });
    return;
  }

  const waitTime = Number(data?.waitTime ?? data?.estimatedWaitTime ?? 0);
  if (waitTime < 0) {
    console.warn('[CallQueue] Invalid waitTime (negative), ignoring');
    return;
  }

  const snapshot = normalizeQueueSnapshot(data, callStore.roomId);
  callStore.setQueueData(snapshot);

  if (snapshot.position > 0 || waitTime > 0) {
    callStore.setStatus('queued');
    if (waitTime > 0) {
      callStore.startQueueTimer(waitTime);
    }
    return;
  }

  // Direct path: position 0 and no wait — same as chat leaving queue for accept,
  // but call starts the Call screen (WebRTC accept still happens on Call screen).
  if (snapshot.position === 0 && waitTime <= 0) {
    callStore.stopQueueTimer();
    callStore.clearQueue();
    promoteCallToCalling('QUEUE_POSITION direct');
  }
};

export const applyCallQueueUpdate = (data: any): void => {
  if (!data || isCallSessionActive()) {
    return;
  }
  if (!isCallRequestPending()) {
    return;
  }

  const callStore = useCallStore.getState();
  if (callStore.pendingCallCancelled) {
    return;
  }

  const incomingRoomId =
    data?.roomId || data?.room_id || data?.roomid || null;
  if (
    incomingRoomId &&
    callStore.roomId &&
    String(incomingRoomId) !== String(callStore.roomId)
  ) {
    console.warn('[CallQueue] QUEUE_UPDATE ignored — roomId mismatch', {
      incoming: incomingRoomId,
      current: callStore.roomId,
    });
    return;
  }

  const position = data?.position ?? -1;
  const waitTime = Number(data?.waitTime ?? data?.estimatedWaitTime ?? 0);
  const snapshot = normalizeQueueSnapshot(data, callStore.roomId);

  if (callStore.queueData) {
    callStore.updateQueueData(snapshot);
  } else {
    callStore.setQueueData(snapshot);
  }

  if (waitTime > 0) {
    callStore.startQueueTimer(waitTime);
  } else {
    callStore.stopQueueTimer();
  }

  if (position > 0 || waitTime > 0) {
    if (callStore.status !== 'queued') {
      callStore.setStatus('queued');
    }
    return;
  }

  if (position === 0 && waitTime <= 0) {
    promoteCallToCalling('QUEUE_UPDATE cleared');
  }
};
