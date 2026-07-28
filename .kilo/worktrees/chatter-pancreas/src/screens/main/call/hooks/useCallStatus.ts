import {useState, useEffect, useCallback} from 'react';
import {useCallStore} from '../../../../services/call/call.store';
import {webRTCService} from '../../../../services/call/webrtc.service';

type CallStatus =
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

const UI_STATUS: Record<CallStatus, 'ringing' | 'connecting' | 'connected'> = {
  idle: 'ringing',
  queue_checking: 'ringing',
  queued: 'ringing',
  calling: 'ringing',
  ringing: 'ringing',
  connecting: 'connecting',
  connecting_webrtc: 'connecting',
  creating_offer: 'connecting',
  sending_offer: 'connecting',
  waiting_answer: 'connecting',
  creating_answer: 'connecting',
  waiting_connection: 'connecting',
  connected: 'connected',
  ended: 'connected',
  rejected: 'ringing',
};

export const useCallStatus = () => {
  const rawStatus = useCallStore(state => state.status);
  const remoteStream = useCallStore(state => state.remoteStream);
  const [connectionState, setConnectionState] = useState<string>('new');

  useEffect(() => {
    webRTCService.handleConnectionStateChange(setConnectionState);
  }, []);

  const derivedStatus = useCallback(():
    | 'ringing'
    | 'connecting'
    | 'connected' => {
    if (connectionState === 'connected' || connectionState === 'completed') {
      return 'connected';
    }
    if (remoteStream) {
      return 'connected';
    }
    return UI_STATUS[rawStatus] || 'connecting';
  }, [connectionState, remoteStream, rawStatus]);

  return {
    status: derivedStatus(),
    rawStatus,
    connectionState,
    isConnecting: derivedStatus() === 'connecting',
    isConnected: derivedStatus() === 'connected',
  };
};
