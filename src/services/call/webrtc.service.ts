import {
  MediaStream,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from 'react-native-webrtc';
import {
  CallState,
  CallConfig,
  DEFAULT_CALL_CONFIG,
  CallRequestData,
} from './call.types';
import {socketService} from '../socket/socket.service';
import {useCallStore} from './call.store';
import InCallManager from 'react-native-incall-manager';

const ICE_CONFIG: CallConfig = {
  iceServers: [
    {urls: 'stun:stun.l.google.com:19302'},
    {urls: 'stun:stun1.l.google.com:19302'},
    {urls: 'stun:stun2.l.google.com:19302'},
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
  bundlePolicy: 'max-bundle' as any,
  rtcpMuxPolicy: 'require' as any,
};

type IceCandidatePayload = {
  room_id: string | null;
  candidate: {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
  };
};

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;
  private config: CallConfig = ICE_CONFIG;

  private onStateChange?: (state: CallState) => void;

  private callId: string | null = null;
  private callerId: string | null = null;
  private calleeId: string | null = null;
  private room_id: string | null = null;

  private pendingICECandidates: Array<{
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
  }> = [];
  private pendingAnswer: {
    sdp: RTCSessionDescription;
    room_id: string;
  } | null = null;

  private isSpeakerOn: boolean = true;
  private isAudioSessionStarted: boolean = false;
  private isPeerConnectionReady: boolean = false;
  private peerJoinedReceived: boolean = false;

  // Callbacks for hooks
  private onRemoteStreamCallback?: (stream: MediaStream | null) => void;
  private onICECandidateCallback?: (candidate: RTCIceCandidate | null) => void;
  private onConnectionStateChangeCallback?: (state: string) => void;

  constructor(_config: CallConfig = DEFAULT_CALL_CONFIG) {
    this.config = ICE_CONFIG;
  }

  setConfig(config: CallConfig) {
    this.config = config;
  }

  setCallInfo(data: {
    callId: string;
    callerId: string;
    calleeId: string;
    room_id: string;
  }) {
    this.callId = data.callId;
    this.callerId = data.callerId;
    this.calleeId = data.calleeId;
    this.room_id = data.room_id;
    console.log('[WebRTC] setCallInfo - room_id:', this.room_id);
  }

  setStateCallback(callback: (state: CallState) => void) {
    this.onStateChange = callback;
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

  getCallId(): string | null {
    return this.callId;
  }

  getRoomId(): string | null {
    // Kept method name for callers, but internal storage is room_id.
    return this.room_id;
  }

  getCallerId(): string | null {
    return this.callerId;
  }

  getCalleeId(): string | null {
    return this.calleeId;
  }

  private _ensurePeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      return this.peerConnection;
    }
    console.log('[WebRTC] _ensurePeerConnection: creating new PC');
    const pc = this._createPeerConnection();
    return pc;
  }

  private async _logICEStats(): Promise<void> {
    if (!this.peerConnection) {
      return;
    }
    try {
      const stats = await this.peerConnection.getStats();
      let iceCandidatePairs = 0;
      let nominated = 0;
      stats.forEach((report: any) => {
        if (report.type === 'candidate-pair') {
          iceCandidatePairs++;
          if (report.nominated) {
            nominated++;
          }
        }
      });
      console.log('[WebRTC ICE Stats]', {
        iceCandidatePairs,
        nominated,
      });
    } catch (e) {
      console.warn('[WebRTC] Failed to get ICE stats:', e);
    }
  }

  private async _logRTPStats(): Promise<void> {
    if (!this.peerConnection) {
      return;
    }
    try {
      const stats = await this.peerConnection.getStats();
      stats.forEach((report: any) => {
        if (report.type === 'remote-inbound-rtp' && report.kind === 'audio') {
          console.log('[WebRTC RTP Stats] Remote audio inbound:', {
            roundTripTime: report.roundTripTime,
            timestamp: report.timestamp,
          });
        }
      });
    } catch (e) {
      console.warn('[WebRTC] Failed to get RTP stats:', e);
    }
  }

  async addICECandidate(candidate: any): Promise<void> {
    try {
      const pc = this.peerConnection;
      if (!pc) {
        console.log('[WebRTC] No PeerConnection — queuing ICE candidate');
        this.pendingICECandidates.push(candidate);
        return;
      }

      if (pc.remoteDescription) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('[WebRTC] ICE candidate added immediately');
      } else {
        this.pendingICECandidates.push(candidate);
        console.log(
          '[WebRTC] No remoteDescription yet — queuing ICE candidate. Queue size:',
          this.pendingICECandidates.length,
        );
      }
    } catch (error) {
      console.error('[WebRTC] Failed to add ICE candidate:', error);
    }
  }

  private async _flushICECandidates(): Promise<void> {
    if (!this.peerConnection || this.pendingICECandidates.length === 0) {
      return;
    }
    console.log(
      '[WebRTC] Flushing',
      this.pendingICECandidates.length,
      'queued ICE candidates',
    );

    const queue = [...this.pendingICECandidates];
    this.pendingICECandidates = [];

    for (const candidate of queue) {
      try {
        await this.peerConnection.addIceCandidate(
          new RTCIceCandidate(candidate),
        );
        console.log('[WebRTC] Queued ICE candidate flushed successfully');
      } catch (error) {
        console.error('[WebRTC] Failed to flush ICE candidate:', error);
      }
    }
  }

  private _flushPendingAnswer(): void {
    if (!this.pendingAnswer) {
      return;
    }

    const {sdp, room_id} = this.pendingAnswer;
    this.pendingAnswer = null;

    console.log('[WebRTC] Flushing queued answer — room_id:', room_id);

    void this.handleAnswer({sdp, room_id});
  }

  emitState(
    status: CallState['status'],
    partial: Partial<Omit<CallState, 'status'>> = {},
  ) {
    const audioTrack = this.localStream?.getAudioTracks()[0];
    const isMuted = audioTrack ? !audioTrack.enabled : false;

    console.log(`[WebRTC] connected emitted: ${status}`);

    this.onStateChange?.({
      callId: this.callId,
      callerId: this.callerId,
      calleeId: this.calleeId,
      roomId: this.room_id || null,
      participant: partial.participant || null,
      status,
      localStream: this.localStream,
      remoteStream: this.remoteStream,
      isMuted,
      isSpeakerOn: this.isSpeakerOn,
      callDuration: 0,
      callDurationRemaining: useCallStore.getState().callDurationRemaining,
      error: partial.error || null,
    });
  }

  async requestPermissions(): Promise<boolean> {
    try {
      await mediaDevices.getUserMedia({
        // audio: {
        //   echoCancellation: true,
        //   noiseSuppression: true,
        //   autoGainControl: true,
        //   channelCount: 1,
        //   sampleRate: 48000,
        //   sampleSize: 16,
        // },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      return true;
    } catch (error) {
      console.error('[WebRTC] Permission error:', error);
      this.emitState('ended', {error: 'Microphone permission denied'});
      return false;
    }
  }

  async getLocalStream(): Promise<MediaStream> {
    if (this.localStream) {
      console.log('[WebRTC] Local stream already exists, reusing it');
      return this.localStream;
    }

    console.log('[WebRTC] Requesting getUserMedia (audio-only)');

    const stream = await mediaDevices.getUserMedia({
      // audio: {
      //   echoCancellation: true,
      //   noiseSuppression: true,
      //   autoGainControl: true,
      //   channelCount: 1,
      //   sampleRate: 48000,
      //   sampleSize: 16,
      // },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    stream.getAudioTracks().forEach(track => {
      track.enabled = true;
      console.log('[WebRTC] Local audio track:', {
        enabled: track.enabled,
        readyState: track.readyState,
        muted: track.muted,
        id: track.id,
      });
    });

    this.localStream = stream;

    if (this.peerConnection) {
      this._addTracksToPeerConnection(stream);
    } else {
      console.log(
        '[WebRTC] No peerConnection yet — tracks will be added when PC is created',
      );
    }

    return stream;
  }

  private _addTracksToPeerConnection(stream: MediaStream): void {
    if (!this.peerConnection) {
      console.log('[WebRTC] No peer connection — cannot add tracks');
      return;
    }

    const existingSenders = this.peerConnection.getSenders();

    stream.getTracks().forEach(track => {
      const alreadyAdded = existingSenders.find(
        sender => sender.track?.id === track.id,
      );

      if (alreadyAdded) {
        console.log(
          '[WebRTC] Track already added to sender, skipping:',
          track.kind,
        );
        return;
      }

      console.log('[WebRTC] Adding local track to PC:', track.kind);
      this.peerConnection!.addTrack(track, stream);
    });

    this._logTransceivers();
  }

  private _logTransceivers(): void {
    if (!this.peerConnection) {
      return;
    }
    const transceivers = this.peerConnection.getTransceivers();
    console.log('[WebRTC] Transceivers:', transceivers.length);
  }

  private hasEmittedConnected: boolean = false;

  private _createPeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      console.log('[WebRTC] PC already exists — returning existing');
      return this.peerConnection;
    }

    // Reset connected emission flag for new peer connection
    this.hasEmittedConnected = false;

    console.log('[WebRTC] Creating new PeerConnection');
    const pc = new RTCPeerConnection(this.config);

    (pc as any).onicecandidate = (event: any) => {
      if (!event.candidate) {
        console.log('[WebRTC] ICE gathering complete (null candidate)');
        return;
      }

      if (this.onICECandidateCallback) {
        this.onICECandidateCallback(event.candidate);
      }

      if (!this.callId) {
        return;
      }

      const candidate = {
        candidate: event.candidate.candidate,
        sdpMid: event.candidate.sdpMid,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
      };

      const icePayload: IceCandidatePayload = {
        room_id: this.room_id,
        candidate,
      };

      console.log('[SIGNALING]', 'ice-candidate', icePayload.room_id);
      socketService.emit('ice-candidate', icePayload);
    };

    (pc as any).ontrack = (event: any) => {
      console.log('[WebRTC] ontrack fired:', {
        kind: event.track.kind,
        streams: event.streams?.length || 0,
      });

      if (event.streams && event.streams[0]) {
        const stream = event.streams[0];
        this.remoteStream = stream;

        stream.getAudioTracks().forEach((track: any) => {
          track.enabled = true;
          console.log('[WebRTC] Remote audio track enabled:', {
            enabled: track.enabled,
            muted: track.muted,
            readyState: track.readyState,
            id: track.id,
          });
        });

        this._ensureSpeakerphone();

        if (this.onRemoteStreamCallback) {
          this.onRemoteStreamCallback(stream);
        }

        this._logRTPStats();

        // Only emit 'connected' once to prevent duplicate timer creation
        if (!this.hasEmittedConnected) {
          this.hasEmittedConnected = true;
          console.log('[WebRTC] ontrack emitting connected (first time)');
          this.emitState('connected');
        } else {
          console.log('[WebRTC] ontrack skipping connected (already emitted)');
        }
      } else {
        // No stream yet, still emit connected but with flag check
        if (!this.hasEmittedConnected) {
          this.hasEmittedConnected = true;
          console.log(
            '[WebRTC] ontrack (no stream) emitting connected (first time)',
          );
          this.emitState('connected');
        } else {
          console.log(
            '[WebRTC] ontrack (no stream) skipping connected (already emitted)',
          );
        }
      }
    };

    (pc as any).oniceconnectionstatechange = () => {
      const state = pc.iceConnectionState;
      console.log('[WebRTC] ICE connection state:', state);

      if (state === 'connected' || state === 'completed') {
        this._ensureSpeakerphone();
        this._logICEStats();
        this._logRTPStats();
      }
    };

    (pc as any).onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log('[WebRTC] Connection state:', state);

      if (this.onConnectionStateChangeCallback) {
        this.onConnectionStateChangeCallback(state);
      }

      this._logRTPStats();

      if (state === 'failed') {
        // Do not reconnect / destroy PC during any intermediate call state.
        // The current offer flow (creating_offer / waiting_answer / connecting)
        // must preserve the active peerConnection until the remote answer arrives
        // or the call is explicitly ended / times out.
        const currentStatus = useCallStore.getState().status;
        const inIntermediateState = [
          'creating_offer',
          'waiting_answer',
          'connecting',
        ].includes(currentStatus);
        if (inIntermediateState) {
          console.log(
            '[WebRTC] Connection failed during intermediate state "%s" — skipping _attemptReconnect, keeping active PC',
            currentStatus,
          );
        } else {
          this._attemptReconnect();
        }
        console.log('[WebRTC] Connection failed');
      }
    };

    this.peerConnection = pc;
    this.isPeerConnectionReady = true;

    if (this.localStream) {
      this._addTracksToPeerConnection(this.localStream);
    }

    this._flushICECandidates();
    this._flushPendingAnswer();

    return pc;
  }

  createPeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      return this.peerConnection;
    }
    return this._createPeerConnection();
  }

  private _ensureSpeakerphone(): void {
    try {
      InCallManager.setSpeakerphoneOn(this.isSpeakerOn);
    } catch (error) {
      console.error(error);
    }
  }

  // private _ensureSpeakerphone(): void {
  //   try {
  //     InCallManager.setSpeakerphoneOn(this.isSpeakerOn);
  //     InCallManager.setForceSpeakerphoneOn(this.isSpeakerOn);
  //     console.log('[InCallManager] Speakerphone ensured:', this.isSpeakerOn);
  //   } catch (error) {
  //     console.error('[InCallManager] setSpeakerphoneOn error:', error);
  //   }
  // }

  private async _startAudioSession(): Promise<void> {
    if (this.isAudioSessionStarted) {
      console.log('[InCallManager] Audio session already started');
      return;
    }

    if (!this.localStream) {
      console.warn(
        '[InCallManager] WARNING: No local stream — audio session start deferred',
      );
      return;
    }

    try {
      // InCallManager.start({media: 'audio'});
      // InCallManager.setForceSpeakerphoneOn(true);
      // InCallManager.setSpeakerphoneOn(true);
      // InCallManager.setMicrophoneMute(false);
      // InCallManager.setSpeakerphoneOn(true);
      InCallManager.start({
        media: 'audio',
      });

      InCallManager.setSpeakerphoneOn(true);
      InCallManager.setMicrophoneMute(false);

      this.isSpeakerOn = true;
      this.isAudioSessionStarted = true;
      console.log('[InCallManager] Audio session started');
    } catch (error) {
      console.error('[InCallManager] startAudioSession error:', error);
    }
  }

  async startCallAsCaller(request: CallRequestData): Promise<void> {
    try {
      this.callId = request.callId;
      this.callerId = request.callerId;
      this.calleeId = request.calleeId;
      this.room_id = request.room_id;

      if (!this.peerConnection) {
        this._createPeerConnection();
      }

      await this.getLocalStream();
      await this._startAudioSession();

      useCallStore.setState({
        status: 'calling',
        localStream: this.localStream,
      });
    } catch (error: any) {
      this.cleanup();
      this.emitState('ended', {
        error: error.message || 'Failed to initialize call',
      });
      throw error;
    }
  }

  async acceptCall(request: CallRequestData): Promise<void> {
    try {
      this.callId = request.callId;
      this.callerId = request.callerId;
      this.calleeId = request.calleeId;
      this.room_id = request.room_id;

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Microphone permission denied');
      }

      this._createPeerConnection();
      await this.getLocalStream();
      await this._startAudioSession();

      console.log('[WebRTC] acceptCall: sending webrtc_call_accepted');
      socketService.emit('webrtc_call_accepted', {
        callId: this.callId,
        calleeId: this.calleeId,
      } as any);

      useCallStore.setState({
        status: 'connecting',
        localStream: this.localStream,
        participant: {
          id: request.callerId,
          name: request.callerName,
          image: request.callerImage,
        },
      });
    } catch (error: any) {
      this.cleanup();
      socketService.emit('webrtc_call_rejected', {
        callId: this.callId,
      } as any);
      this.emitState('ended', {
        error: error.message || 'Failed to accept call',
      });
    }
  }

  private async _createAndSendOffer(): Promise<void> {
    useCallStore.setState({status: 'creating_offer'});

    // const offer = await this.peerConnection!.createOffer({
    //   offerToReceiveAudio: true,
    //   offerToReceiveVideo: false,
    //   voiceActivityDetection: true,
    // });
    const offer = await this.peerConnection!.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
      voiceActivityDetection: false,
    });

    await this.peerConnection!.setLocalDescription(offer);

    const offerPayload = {
      room_id: this.room_id,
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };

    console.log(
      '[SIGNALING]',
      'offer',
      offerPayload.room_id,
      'type',
      offer.type,
    );

    socketService.emit('offer', offerPayload);

    useCallStore.setState({status: 'waiting_answer'});
  }

  async handlePeerJoined(request: CallRequestData): Promise<void> {
    try {
      // Deduplicate: ignore duplicate peer_joined if we already handled one.
      if (this.peerJoinedReceived) {
        console.log(
          '[WebRTC] peer_joined already received — skipping duplicate',
        );
        return;
      }
      this.peerJoinedReceived = true;

      // role is determined by callerId stored in this service
      // const isCaller = true;
      const isCaller = request.callerId === this.callerId;

      if (isCaller) {
        if (!this.peerConnection) {
          this._createPeerConnection();
        }
        if (!this.localStream) {
          await this.getLocalStream();
        }
        await this._createAndSendOffer();
      } else {
        if (!this.peerConnection) {
          this._createPeerConnection();
        }
        if (!this.localStream) {
          await this.getLocalStream();
        }
        // callee waits for offer
      }
    } catch (error: any) {
      this.cleanup();
      this.emitState('ended', {
        error: error.message || 'Failed to handle peer_joined',
      });
    }
  }

  async handleOffer({
    sdp,
    callId,
    callerId,
  }: {
    sdp: RTCSessionDescription;
    callId: string;
    callerId: string;
  }) {
    try {
      this.callId = callId;
      this.callerId = callerId;

      const pc = this._ensurePeerConnection();

      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      await this._flushICECandidates();

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      const answerPayload = {
        room_id: this.room_id,
        answer: {
          type: answer.type,
          sdp: answer.sdp,
        },
      };

      console.log(
        '[SIGNALING]',
        'answer',
        answerPayload.room_id,
        'type',
        answer.type,
      );

      socketService.emit('answer', answerPayload);

      useCallStore.setState({status: 'waiting_connection'});
    } catch (error: any) {
      this.emitState('ended', {
        error: error.message || 'Failed to handle offer',
      });
    }
  }

  async handleAnswer({
    sdp,
    room_id,
  }: {
    sdp: RTCSessionDescription;
    room_id: string;
  }) {
    try {
      this.room_id = room_id;

      if (!this.peerConnection) {
        console.warn(
          '[WebRTC] handleAnswer: peerConnection is null — queuing answer',
        );
        this.pendingAnswer = {sdp, room_id};
        return;
      }

      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(sdp),
      );

      await this._flushICECandidates();
    } catch (error: any) {
      console.log('[WebRTC] handleAnswer ERROR:', error);
    }
  }

  async handleIceCandidate({
    candidate,
    room_id,
  }: {
    candidate: {
      candidate: string;
      sdpMid: string | null;
      sdpMLineIndex: number | null;
    };
    room_id: string;
  }) {
    try {
      this.room_id = room_id;

      if (!this.peerConnection) {
        this.pendingICECandidates.push(candidate);
        return;
      }

      if (!this.peerConnection.remoteDescription) {
        this.pendingICECandidates.push(candidate);
        return;
      }

      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (error: any) {
      console.error('[WebRTC] Add ICE candidate error:', error);
    }
  }

  toggleMute(): boolean {
    console.log('[WebRTC] toggleMute called');
    if (!this.localStream) {
      return false;
    }
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (!audioTrack) {
      return false;
    }

    const wasEnabled = audioTrack.enabled;
    audioTrack.enabled = !wasEnabled;
    InCallManager.setMicrophoneMute(wasEnabled);
    // isMuted is the inverse of track.enabled, not the new enabled value
    const isMuted = !audioTrack.enabled;
    console.log('[WebRTC] toggleMute updated isMuted to:', isMuted);
    // Only update isMuted in store - do NOT change status
    useCallStore.setState({isMuted});
    return isMuted;
  }

  toggleSpeaker(speakerOn: boolean): boolean {
    this.isSpeakerOn = speakerOn;
    InCallManager.setSpeakerphoneOn(speakerOn);
    InCallManager.setForceSpeakerphoneOn(speakerOn);
    return speakerOn;
  }

  async startAudioSession(): Promise<void> {
    await this._startAudioSession();
  }

  private async _attemptReconnect(): Promise<void> {
    try {
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
        this.isPeerConnectionReady = false;
      }

      this.pendingICECandidates = [];
      this._createPeerConnection();

      if (this.localStream) {
        this._addTracksToPeerConnection(this.localStream);
      }

      if (this.callerId && this.room_id) {
        await this._createAndSendOffer();
      }
    } catch (error) {
      console.error('[WebRTC] _attemptReconnect failed:', error);
    }
  }

  async reconnect(): Promise<void> {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }

    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
      this.isPeerConnectionReady = false;
    }

    this.pendingICECandidates = [];
    await this.getLocalStream();
    this._createPeerConnection();
  }

  cleanup(stopAudio: boolean = true) {
    if (stopAudio) {
      this.stopAudioSession();
    }

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
      this.isPeerConnectionReady = false;
    }

    this.callId = null;
    this.callerId = null;
    this.calleeId = null;
    this.room_id = null;
    this.pendingICECandidates = [];
    this.peerJoinedReceived = false;
    this.hasEmittedConnected = false;

    useCallStore.setState({status: 'ended'});
  }

  private stopAudioSession(): void {
    try {
      InCallManager.stop();
      this.isAudioSessionStarted = false;
    } catch (error) {
      console.error('[InCallManager] Error stopping audio session:', error);
    }
  }
}

export const webRTCService = new WebRTCService();
export const getWebRTCService = (): WebRTCService => webRTCService;

let listenersSetup = false;
let lastSocketId: string | null = null;

export const setupWebRTCListeners = () => {
  const socket = socketService.getSocket();
  if (!socket) {
    console.log('[WebRTC] No socket available for setting up listeners');
    return;
  }

  if (listenersSetup && lastSocketId === socket.id) {
    return;
  }

  lastSocketId = socket.id || null;
  listenersSetup = true;

  (socket as any).off('offer');
  (socket as any).off('answer');
  (socket as any).off('ice-candidate');
  (socket as any).off('peer_joined');

  const svc = getWebRTCService();

  // (socket as any).on('peer_joined', async (data: any) => {
  //   try {
  //     // peer_joined must provide enough for role determination.
  //     // Required payload key is room_id.
  //     const room_id: string | null = data?.room_id ?? null;
  //     if (!room_id) {
  //       console.warn('[WebRTC] peer_joined: missing room_id');
  //       return;
  //     }

  //     const currentCallId = svc.getCallId();
  //     const currentCallerId = svc.getCallerId();
  //     const currentCalleeId = svc.getCalleeId();

  //     await svc.handlePeerJoined({
  //       callId: currentCallId || data?.callId || '',
  //       callerId: currentCallerId || data?.callerId || '',
  //       calleeId: currentCalleeId || data?.calleeId || '',
  //       room_id,
  //       callerName: data?.callerName || '',
  //       callerImage: data?.callerImage || '',
  //       consultationType: 'call' as any,
  //     } as any);
  //   } catch (error) {
  //     console.error('[WebRTC] peer_joined listener FAILED:', error);
  //   }
  // });

  (socket as any).on('peer_joined', async () => {
    try {
      console.log('[WebRTC] peer_joined RECEIVED');

      const currentRoomId = svc.getRoomId();

      if (!currentRoomId) {
        console.warn('[WebRTC] No currentRoomId found');
        return;
      }

      const currentCallId = svc.getCallId();
      const currentCallerId = svc.getCallerId();
      const currentCalleeId = svc.getCalleeId();

      await svc.handlePeerJoined({
        callId: currentCallId || '',
        callerId: currentCallerId || '',
        calleeId: currentCalleeId || '',
        room_id: currentRoomId,
        callerName: '',
        callerImage: '',
        consultationType: 'call' as any,
      } as any);
    } catch (error) {
      console.error('[WebRTC] peer_joined listener FAILED:', error);
    }
  });

  // (socket as any).on('offer', async (data: any) => {
  //   try {
  //     await svc.handleOffer({
  //       sdp: data.offer,
  //       callId: data.callId,
  //       callerId: data.callerId,
  //     });
  //   } catch (error) {
  //     console.error('[WebRTC] handleOffer failed:', error);
  //   }
  // });

  (socket as any).on('answer', async (data: any) => {
    try {
      await svc.handleAnswer({
        sdp: data.answer,
        room_id: data.room_id,
      });
    } catch (error) {
      console.error('[WebRTC] handleAnswer failed:', error);
    }
  });

  (socket as any).on('ice-candidate', async (data: any) => {
    try {
      await svc.handleIceCandidate({
        candidate: data.candidate,
        room_id: data.room_id,
      });
    } catch (error) {
      console.error('[WebRTC] handleIceCandidate failed:', error);
    }
  });
};
