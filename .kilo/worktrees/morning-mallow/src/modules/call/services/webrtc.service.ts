import {
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  mediaDevices,
  MediaStream,
} from 'react-native-webrtc';
import {
  WebRTCConfig,
  DEFAULT_MEDIA_CONSTRAINTS,
  MediaConstraints,
} from '../types/call.types';
import {RTCSessionDescriptionInit} from 'react-native-webrtc/lib/typescript/RTCSessionDescription';

class WebRTCService {
  private peerConnection: any | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private config: WebRTCConfig;
  private onRemoteStreamCallback:
    | ((stream: MediaStream | null) => void)
    | null = null;
  private onICECandidateCallback:
    | ((candidate: RTCIceCandidate | null) => void)
    | null = null;
  private onConnectionStateChangeCallback: ((state: string) => void) | null =
    null;

  constructor() {
    this.config = {
      iceServers: [
        {urls: 'stun:stun.l.google.com:19302'},
        {urls: 'stun:stun1.l.google.com:19302'},
        {urls: 'stun:stun2.l.google.com:19302'},
      ],
    };
  }

  setIceServers(servers: WebRTCConfig['iceServers']): void {
    this.config.iceServers = servers;
  }

  async getLocalStream(
    constraints: MediaConstraints = DEFAULT_MEDIA_CONSTRAINTS,
  ): Promise<MediaStream | null> {
    try {
      const stream = await mediaDevices.getUserMedia(constraints);
      this.localStream = stream as MediaStream;
      return stream as MediaStream;
    } catch (error) {
      console.log('Failed to get local stream:', error);
      return null;
    }
  }

  createPeerConnection(): RTCPeerConnection | null {
    try {
      this.peerConnection = new RTCPeerConnection(this.config);

      this.peerConnection.onicecandidate = (event: {
        candidate: RTCIceCandidate | null;
      }) => {
        if (event.candidate && this.onICECandidateCallback) {
          this.onICECandidateCallback(event.candidate);
        }
      };

      this.peerConnection.onaddstream = (event: {
        stream: MediaStream | null;
      }) => {
        this.remoteStream = event.stream;
        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(event.stream);
        }
      };

      this.peerConnection.onremovestream = () => {
        this.remoteStream = null;
        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(null);
        }
      };

      this.peerConnection.oniceconnectionstatechange = () => {
        const state = this.peerConnection?.iceConnectionState;
        console.log('ICE Connection State:', state);
        if (this.onConnectionStateChangeCallback && state) {
          this.onConnectionStateChangeCallback(state);
        }
      };

      if (this.localStream) {
        this.localStream.getTracks().forEach(track => {
          this.peerConnection?.addTrack(track, this.localStream!);
        });
      }

      return this.peerConnection;
    } catch (error) {
      console.log('Failed to create peer connection:', error);
      return null;
    }
  }

  async createOffer(): Promise<RTCSessionDescription | null> {
    if (!this.peerConnection) {
      console.log('Peer connection not initialized');
      return null;
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      });
      await this.peerConnection.setLocalDescription(offer);
      return new RTCSessionDescription(offer);
    } catch (error) {
      console.log('Failed to create offer:', error);
      return null;
    }
  }

  async createAnswer(): Promise<RTCSessionDescription | null> {
    if (!this.peerConnection) {
      console.log('Peer connection not initialized');
      return null;
    }

    try {
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return new RTCSessionDescription(answer);
    } catch (error) {
      console.log('Failed to create answer:', error);
      return null;
    }
  }

  async handleOffer(
    offer: RTCSessionDescriptionInit,
  ): Promise<RTCSessionDescription | null> {
    if (!this.peerConnection) {
      console.log('Peer connection not initialized');
      return null;
    }

    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(offer),
      );
      const answer = await this.createAnswer();
      return answer;
    } catch (error) {
      console.log('Failed to handle offer:', error);
      return null;
    }
  }

  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (!this.peerConnection) {
      console.log('Peer connection not initialized');
      return;
    }

    try {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    } catch (error) {
      console.log('Failed to handle answer:', error);
    }
  }

  async addICECandidate(candidate: any): Promise<void> {
    if (!this.peerConnection) {
      console.log('Peer connection not initialized');
      return;
    }

    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error) {
      console.log('Failed to add ICE candidate:', error);
    }
  }

  attachLocalStream(stream: MediaStream): void {
    this.localStream = stream;
    if (this.peerConnection && stream) {
      stream.getTracks().forEach(track => {
        this.peerConnection?.addTrack(track, stream);
      });
    }
  }

  handleRemoteStream(callback: (stream: MediaStream | null) => void): void {
    this.onRemoteStreamCallback = callback;
  }

  handleICECandidate(
    callback: (candidate: RTCIceCandidate | null) => void,
  ): void {
    this.onICECandidateCallback = callback;
  }

  handleConnectionStateChange(callback: (state: string) => void): void {
    this.onConnectionStateChangeCallback = callback;
  }

  toggleMute(mute: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = !mute;
      });
    }
  }

  toggleVideo(enable: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach(track => {
        track.enabled = enable;
      });
    }
  }

  toggleSpeaker(speakerOn: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        if (track.label.includes('speaker')) {
          track.enabled = speakerOn;
        }
      });
    }
  }

  async switchCamera(): Promise<void> {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack && typeof videoTrack._switchCamera === 'function') {
        videoTrack._switchCamera();
      }
    }
  }

  getLocalStreamInstance(): MediaStream | null {
    return this.localStream;
  }

  getRemoteStreamInstance(): MediaStream | null {
    return this.remoteStream;
  }

  async reconnect(): Promise<void> {
    this.cleanup();
    this.localStream = await this.getLocalStream();
    this.createPeerConnection();
  }

  cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.remoteStream) {
      this.remoteStream.getTracks().forEach(track => track.stop());
      this.remoteStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }

    this.onRemoteStreamCallback = null;
    this.onICECandidateCallback = null;
    this.onConnectionStateChangeCallback = null;
  }

  getConnectionState(): string | undefined {
    return this.peerConnection?.iceConnectionState;
  }

  isConnected(): boolean {
    const state = this.peerConnection?.iceConnectionState;
    return state === 'connected' || state === 'completed';
  }
}

export const webrtcService = new WebRTCService();
export default webrtcService;
