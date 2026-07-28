import {socketService} from '../socket/socket.service';
import {webRTCService} from './webrtc.service';
import {CallRequestData} from './call.types';
import {useCallStore} from './call.store';

export interface SignalingCallbacks {
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

    // Clean up legacy WebRTC events
    socket.off('webrtc_call_accepted');
    socket.off('webrtc_call_rejected');
    socket.off('webrtc_call_end');
    socket.off('webrtc_offer');
    socket.off('webrtc_answer');
    socket.off('webrtc_ice_candidate');

    // New flow events handled by webrtc.service via setupWebRTCListeners()
    // Do NOT register peer_joined, answer, ice-candidate here
    // They are already handled in webrtc.service.ts setupWebRTCListeners()

    socket.on('webrtc_call_accepted', (data: {callId: string}) => {
      console.log('[Signaling] Call accepted (legacy):', data);
      this.callbacks?.onCallAccepted(data);
    });

    socket.on(
      'webrtc_call_rejected',
      (data: {callId: string; reason?: string}) => {
        console.log('[Signaling] Call rejected (legacy):', data);
        this.callbacks?.onCallRejected(data);
      },
    );

    socket.on('webrtc_call_end', (data: {callId: string}) => {
      console.log('[Signaling] Call ended (legacy):', data);
      this.callbacks?.onCallEnded(data);
    });

    // socket.on('call_ended_by_astrologer', (data: {room_id: string}) => {
    //   console.log('[Signaling] Astrologer ended call:', data);
    //   this.callbacks?.onCallEnded({callId: data.room_id});
    // });
    socket.off('call_cancel_by_astrologer');
    socket.off('call_ended_by_astrologer');

    socket.on('call_cancel_by_astrologer', (data: {room_id: string}) => {
      console.log('[SIGNALING] call_cancel_by_astrologer RECEIVED:', data);

      useCallStore.setState({
        status: 'ended',
      });

      // CALLBACK delegates to handleCallEnded → performCallCleanup → full reset
      this.callbacks?.onCallEnded({
        callId: data.room_id,
      });
    });

    socket.on('call_ended_by_astrologer', (data: {room_id: string}) => {
      console.log('[SIGNALING] call_ended_by_astrologer RECEIVED:', data);

      useCallStore.setState({
        status: 'ended',
      });

      // CALLBACK delegates to handleCallEnded → performCallCleanup → full reset
      this.callbacks?.onCallEnded({
        callId: data.room_id,
      });
    });

    this.isRegistered = true;
  }

  unregisterListeners() {
    const socket = socketService.getSocket();
    if (!socket) {
      return;
    }

    socket.off('webrtc_call_accepted');
    socket.off('webrtc_call_rejected');
    socket.off('webrtc_call_end');
    socket.off('call_ended_by_astrologer');
    socket.off('call_cancel_by_astrologer');

    this.isRegistered = false;
  }

  initiateCall(data: CallRequestData): void {
    socketService.emit('webrtc_initiate_call', data as any);
  }
}

export const signalingService = new SignalingService();
