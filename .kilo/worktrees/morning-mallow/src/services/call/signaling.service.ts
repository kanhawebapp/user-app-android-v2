import {socketService} from '../socket/socket.service';
import {webRTCService} from './webrtc.service';
import {CallRequestData} from './call.types';

export interface SignalingCallbacks {
  onIncomingCall: (data: CallRequestData) => void;
  onCallAccepted: (data: {callId: string}) => void;
  onCallRejected: (data: {callId: string; reason?: string}) => void;
  onCallEnded: (data: {callId: string}) => void;
}

class SignalingService {
  private callbacks: SignalingCallbacks | null = null;
  private isRegistered = false;

  registerCallbacks(callbacks: SignalingCallbacks) {
    this.callbacks = callbacks;
    this.registerSocketListeners();
  }

  private registerSocketListeners() {
    if (this.isRegistered) {
      return;
    }

    const socket = socketService.getSocket();
    if (!socket) {
      return;
    }

    socket.off('webrtc_incoming_call');
    socket.off('webrtc_call_accepted');
    socket.off('webrtc_call_rejected');
    socket.off('webrtc_call_end');
    socket.off('webrtc_offer');
    socket.off('webrtc_answer');
    socket.off('webrtc_ice_candidate');

    socket.on('webrtc_incoming_call', (data: CallRequestData) => {
      this.callbacks?.onIncomingCall(data);
    });

    socket.on('webrtc_call_accepted', (data: {callId: string}) => {
      this.callbacks?.onCallAccepted(data);
    });

    socket.on(
      'webrtc_call_rejected',
      (data: {callId: string; reason?: string}) => {
        this.callbacks?.onCallRejected(data);
      },
    );

    socket.on('webrtc_call_end', (data: {callId: string}) => {
      this.callbacks?.onCallEnded(data);
    });

    this.isRegistered = true;
  }

  unregisterListeners() {
    const socket = socketService.getSocket();
    if (!socket) {
      return;
    }

    socket.off('webrtc_incoming_call');
    socket.off('webrtc_call_accepted');
    socket.off('webrtc_call_rejected');
    socket.off('webrtc_call_end');
    socket.off('webrtc_offer');
    socket.off('webrtc_answer');
    socket.off('webrtc_ice_candidate');

    this.isRegistered = false;
  }

  initiateCall(data: CallRequestData): void {
    socketService.emit('webrtc_initiate_call', data as any);
  }
}

export const signalingService = new SignalingService();
