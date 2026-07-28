import {
  MediaStream,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {CallState, CallConfig, DEFAULT_CALL_CONFIG, CallRequestData} from './call.types';
import {socketService} from '../socket/socket.service';

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private config: CallConfig;
  private onStateChange?: (state: CallState) => void;
  private callId: string | null = null;
  private callerId: string | null = null;
  private calleeId: string | null = null;
  private pendingCandidates: RTCIceCandidate[] = [];
  private isFrontCamera: boolean = true;

  constructor(config: CallConfig = DEFAULT_CALL_CONFIG) {
    this.config = config;
  }

  setConfig(config: CallConfig) {
    this.config = config;
  }

  setStateCallback(callback: (state: CallState) => void) {
    this.onStateChange = callback;
  }

  private emitState(
    status: CallState['status'],
    partial: Partial<Omit<CallState, 'status'>> = {},
  ) {
    this.onStateChange?.({
      callId: this.callId,
      callerId: this.callerId,
      calleeId: this.calleeId,
      roomId: null,
      participant: partial.participant || null,
      status,
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      isMuted: !this.localStream?.getAudioTracks()[0]?.enabled,
      isSpeakerOn: true,
      isFrontCamera: this.isFrontCamera,
      callDuration: 0,
      error: partial.error || null,
    });
  }

  async requestPermissions(): Promise<boolean> {
    try {
      await mediaDevices.getUserMedia({video: true, audio: true});
      return true;
    } catch (error) {
      console.error('[WebRTC] Permission error:', error);
      this.emitState('ended', {error: 'Camera/Mic permission denied'});
      return false;
    }
  }

  async getLocalStream(front: boolean = true): Promise<MediaStream> {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: front ? 'user' : 'environment',
          width: {ideal: 640},
          height: {ideal: 480},
        } as any,
      });
      this.localStream = stream;
      this.isFrontCamera = front;
      return stream;
    } catch (error) {
      console.error('[WebRTC] getUserMedia error:', error);
      throw error;
    }
  }

  createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection(this.config);

    pc.addEventListener('icecandidate', (event: any) => {
      if (event.candidate && this.callId) {
        socketService.emit('webrtc_ice_candidate', {
          callId: this.callId,
          candidate: event.candidate,
        } as any);
      }
    });

    pc.addEventListener('track', (event: any) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream();
      }
      this.remoteStream.addTrack(event.track);
      this.emitState('connected', {participant: undefined});
    });

    pc.addEventListener('iceconnectionstatechange', () => {
      const state = pc.iceConnectionState;
      if (__DEV__) {
        console.log('[WebRTC] ICE connection state:', state);
      }
      if (state === 'failed' || state === 'disconnected') {
        this.emitState('ended', {error: 'Connection lost'});
      }
    });

    pc.addEventListener('negotiationneeded', async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        if (this.callId) {
          socketService.emit('webrtc_offer', {
            callId: this.callId,
            sdp: offer,
          } as any);
        }
      } catch (error) {
        console.error('[WebRTC] Negotiation error:', error);
      }
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        pc.addTrack(track, this.localStream!);
      });
    }

    this.peerConnection = pc;
    return pc;
  }

  async startCall(request: CallRequestData): Promise<void> {
    try {
      this.callId = request.callId;
      this.callerId = request.callerId;
      this.calleeId = request.calleeId;

      await this.requestPermissions();
      const stream = await this.getLocalStream(true);

      const pc = this.createPeerConnection();

      this.emitState('connecting', {
        participant: {
          id: request.calleeId,
          name: request.callerName,
          image: request.callerImage,
        },
      });

      const offer = await pc.createOffer({iceRestart: true});
      await pc.setLocalDescription(offer);

      socketService.emit('webrtc_offer', {
        callId: this.callId,
        sdp: offer,
        callerId: this.callerId,
        calleeId: this.calleeId,
      } as any);

      this.emitState('calling', {
        participant: {
          id: request.calleeId,
          name: request.callerName,
          image: request.callerImage,
        },
      });
    } catch (error: any) {
      console.error('[WebRTC] Start call error:', error);
      this.emitState('ended', {error: error.message || 'Failed to start call'});
    }
  }

  async acceptCall(request: CallRequestData): Promise<void> {
    try {
      this.callId = request.callId;
      this.callerId = request.callerId;
      this.calleeId = request.calleeId;

      await this.requestPermissions();
      const stream = await this.getLocalStream(true);

      this.createPeerConnection();

      socketService.emit('webrtc_call_accepted', {
        callId: this.callId,
        calleeId: this.calleeId,
      } as any);

      this.emitState('connecting', {
        participant: {
          id: request.callerId,
          name: request.callerName,
          image: request.callerImage,
        },
      });
    } catch (error: any) {
      console.error('[WebRTC] Accept call error:', error);
      socketService.emit('webrtc_call_rejected', {
        callId: this.callId,
      } as any);
      this.emitState('ended', {error: error.message || 'Failed to accept call'});
    }
  }

  async handleOffer({sdp, callId, callerId}: {sdp: RTCSessionDescription; callId: string; callerId: string}) {
    try {
      this.callId = callId;
      this.callerId = callerId;

      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await this.peerConnection!.createAnswer();
      await this.peerConnection!.setLocalDescription(answer);

      socketService.emit('webrtc_answer', {
        callId: this.callId,
        sdp: answer,
      } as any);
    } catch (error) {
      console.error('[WebRTC] Handle offer error:', error);
    }
  }

  async handleAnswer({sdp, callId}: {sdp: RTCSessionDescription; callId: string}) {
    try {
      await this.peerConnection?.setRemoteDescription(new RTCSessionDescription(sdp));
      this.emitState('connected');
    } catch (error) {
      console.error('[WebRTC] Handle answer error:', error);
    }
  }

  async handleIceCandidate({candidate}: {candidate: RTCIceCandidate}) {
    try {
      if (this.peerConnection?.remoteDescription) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        this.pendingCandidates.push(candidate);
      }
    } catch (error) {
      console.error('[WebRTC] Add ICE candidate error:', error);
    }
  }

  toggleMute(): boolean {
    if (!this.localStream) return false;
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      this.emitState('connected');
      return !audioTrack.enabled;
    }
    return false;
  }

  async switchCamera(): Promise<boolean> {
    if (!this.localStream || !this.peerConnection) return false;
    try {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (!videoTrack) return false;

      const settings = videoTrack.getSettings() as any;
      const isFront = settings.facingMode === 'user';
      const newStream = await this.getLocalStream(!isFront);
      const newVideoTrack = newStream.getVideoTracks()[0];

      const sender = this.peerConnection
        .getSenders()
        .find(s => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(newVideoTrack);
      }

      videoTrack.stop();
      this.localStream.removeTrack(videoTrack);
      this.localStream.addTrack(newVideoTrack);

      return true;
    } catch (error) {
      console.error('[WebRTC] Switch camera error:', error);
      return false;
    }
  }

  async endCall(): Promise<void> {
    if (this.callId) {
      socketService.emit('webrtc_call_end', {callId: this.callId} as any);
    }
    this.cleanup();
    this.emitState('ended');
  }

  rejectCall(): void {
    if (this.callId) {
      socketService.emit('webrtc_call_rejected', {callId: this.callId} as any);
    }
    this.cleanup();
    this.emitState('rejected');
  }

  private cleanup() {
    this.localStream?.getTracks().forEach(track => track.stop());
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection?.close();
    this.peerConnection = null;
    this.callId = null;
    this.callerId = null;
    this.calleeId = null;
    this.pendingCandidates = [];
  }

  getLocalStreamValue(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStreamValue(): MediaStream | null {
    return this.remoteStream;
  }
}

export const webRTCService = new WebRTCService();

export const setupWebRTCListeners = () => {
  socketService.getSocket()?.on('webrtc_offer', (data: any) => {
    webRTCService.handleOffer(data);
  });

  socketService.getSocket()?.on('webrtc_answer', (data: any) => {
    webRTCService.handleAnswer(data);
  });

  socketService.getSocket()?.on('webrtc_ice_candidate', (data: any) => {
    webRTCService.handleIceCandidate(data);
  });
};