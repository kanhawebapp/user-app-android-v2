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

  // ---- Signaling idempotency guards ----
  // Used to prevent duplicate socket events from corrupting peer state.
  private processedOfferIds: Set<string> = new Set();
  private processedAnswerIds: Set<string> = new Set();
  private processedPeerJoinRooms: Set<string> = new Set();
  private processedCandidateKeys: Set<string> = new Set();

  private _hashSDP(sdp: string): string {
    // Non-crypto, stable-ish hash for dedupe. Keeps implementation minimal.
    let h = 0;
    for (let i = 0; i < sdp.length; i++) {
      h = (h * 31 + sdp.charCodeAt(i)) >>> 0;
    }
    return h.toString(16);
  }

   private localStream: MediaStream | null = null;
   private remoteStream: MediaStream | null = null;
   private config: CallConfig = ICE_CONFIG;
   private hasEverConnected: boolean = false;

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
  private remoteStreamReceived: boolean = false;
  private connectionEstablishedTime: number = 0;

  private _resetSignalingGuards(): void {
    this.processedOfferIds.clear();
    this.processedAnswerIds.clear();
    this.processedPeerJoinRooms.clear();
    this.processedCandidateKeys.clear();
  }

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

    // Fire-and-forget flush; any internal errors are logged by handler.
    // eslint-disable-next-line no-void
    void this.handleAnswer({sdp, room_id});
  }

   emitState(
     status: CallState['status'],
     partial: Partial<Omit<CallState, 'status'>> = {},
   ) {
     const audioTrack = this.localStream?.getAudioTracks()[0];
     const isMuted = audioTrack ? !audioTrack.enabled : false;
     const previousStatus = useCallStore.getState().status;
     
     console.log('[STATUS WRITE]', {
       source: 'webrtc.service.ts:emitState',
       previousStatus,
       nextStatus: status,
     });

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
       error: partial.error || null,
       callDurationRemaining: 0,
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

  private _createPeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      console.log('[WebRTC] PC already exists — returning existing');
      return this.peerConnection;
    }

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
       console.log('[WebRTC] ontrack FIRED:', {
         kind: event.track?.kind,
         streams: event.streams?.length || 0,
         streamId: event.streams?.[0]?.id,
       });

       if (event.streams && event.streams[0]) {
         const stream = event.streams[0];
         this.remoteStream = stream;
         console.log('[WebRTC] remoteStream SET:', {
           streamId: stream.id,
           tracks: stream.getTracks().length,
         });

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
           console.log('[WebRTC] onRemoteStreamCallback EXISTS — invoking');
           this.onRemoteStreamCallback(stream);
         } else {
           console.warn(
             '[WebRTC] onRemoteStreamCallback NOT SET — remote stream not propagated',
           );
         }

         this._logRTPStats();
       } else {
         console.warn('[WebRTC] ontrack fired but no streams received');
       }

       this.remoteStreamReceived = true;
       const hadEverConnected = this.hasEverConnected;
       this.hasEverConnected = true;
       if (!hadEverConnected) {
         console.log(
           '[WebRTC] Calling emitState("connected") triggered by ontrack',
         );
         this.emitState('connected');
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
       const currentStoreStatus = useCallStore.getState().status;
       console.log('[WebRTC] onconnectionstatechange:', {
         state,
         storeStatusBefore: currentStoreStatus,
       });

       if (this.onConnectionStateChangeCallback) {
         this.onConnectionStateChangeCallback(state);
       }

       this._logRTPStats();

       if (state === 'connected') {
         this.connectionEstablishedTime = Date.now();
         console.log(
           '[WebRTC] connectionState=connected → calling emitState(connected) [store=%O]',
           useCallStore.getState(),
         );
         // NOTE: We do NOT set status here - only ontrack should do that
         // to prevent race conditions. We just emit the state for listeners.
         this.emitState('connected');
       }

       if (state === 'failed') {
         const currentStatus = useCallStore.getState().status;
         const timeSinceConnected = Date.now() - this.connectionEstablishedTime;
         const recentlyConnected = timeSinceConnected < 5000;

         const shouldSkipReconnect = [
           'creating_offer',
           'waiting_answer',
           'connecting',
           'waiting_connection',
           'connected',
         ].includes(currentStatus);

         // IGNORE transient ICE failures if we've already had a successful connection
         // and have a remote stream (meaning media actually worked)
         if (
           (recentlyConnected || shouldSkipReconnect || this.remoteStreamReceived) &&
           this.hasEverConnected &&
           this.remoteStream
         ) {
           console.log(
             '[WebRTC] Connection failed while in "%s" (hasEverConnected=%s, remoteStreamReceived=%s, recentlyConnected=%s) — ignoring transient failure',
             currentStatus,
             this.hasEverConnected,
             this.remoteStreamReceived,
             recentlyConnected,
           );
         } else {
           console.log(
             '[WebRTC] Connection failed in "%s" — attempting reconnect',
             currentStatus,
           );
           this._attemptReconnect();
         }
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

       console.log('[STATUS WRITE]', {
         source: 'webrtc.service.ts:startCallAsCaller',
         previousStatus: useCallStore.getState().status,
         nextStatus: 'calling',
       });
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

       console.log('[STATUS WRITE]', {
         source: 'webrtc.service.ts:acceptCall',
         previousStatus: useCallStore.getState().status,
         nextStatus: 'connecting',
       });
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
     console.log('[STATUS WRITE]', {
       source: 'webrtc.service.ts:_createAndSendOffer',
       previousStatus: useCallStore.getState().status,
       nextStatus: 'creating_offer',
     });
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

     console.log('[STATUS WRITE]', {
       source: 'webrtc.service.ts:_createAndSendOffer (after offer)',
       previousStatus: 'creating_offer',
       nextStatus: 'waiting_answer',
     });
     useCallStore.setState({status: 'waiting_answer'});
   }

  async handlePeerJoined(request: CallRequestData): Promise<void> {
    try {
      const key = request.room_id ? `room:${request.room_id}` : 'room:unknown';
      if (this.processedPeerJoinRooms.has(key)) {
        console.log('[WebRTC] peer_joined dedup skip', {key});
        return;
      }
      this.processedPeerJoinRooms.add(key);

      // keep legacy flag too (minimal risk)
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
      const sdpStr = (sdp as any)?.sdp || '';
      const roomKey = this.room_id || 'room:unknown';
      const offerKey = `offer:${roomKey}:${this._hashSDP(
        sdpStr,
      )}:${callId}:${callerId}`;
      if (this.processedOfferIds.has(offerKey)) {
        console.log('[WebRTC] offer dedup skip', {offerKey});
        return;
      }
      this.processedOfferIds.add(offerKey);

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

       console.log('[STATUS WRITE]', {
         source: 'webrtc.service.ts:handleOffer',
         previousStatus: useCallStore.getState().status,
         nextStatus: 'waiting_connection',
       });
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
      const sdpStr = (sdp as any)?.sdp || '';
      const answerKey = `answer:${room_id}:${this._hashSDP(sdpStr)}`;
      if (this.processedAnswerIds.has(answerKey)) {
        console.log('[WebRTC] answer dedup skip', {room_id, answerKey});
        return;
      }

      // prevent duplicate answer processing when signaling already stabilized
      if (this.peerConnection?.signalingState === 'stable') {
        console.log(
          '[WebRTC] Duplicate answer ignored - signalingState stable',
          {
            room_id,
          },
        );
        return;
      }

      this.processedAnswerIds.add(answerKey);

      this.room_id = room_id;
      const currentStoreStatus = useCallStore.getState().status;

      console.log('[WebRTC] handleAnswer received:', {
        room_id,
        storeStatus: currentStoreStatus,
        hasPeerConnection: !!this.peerConnection,
        hasRemoteDesc: this.peerConnection?.remoteDescription ? true : false,
      });

      if (!this.peerConnection) {
        console.warn(
          '[WebRTC] handleAnswer: peerConnection is null — queuing answer',
        );
        this.pendingAnswer = {sdp, room_id};
        return;
      }

      console.log('[WebRTC] Applying answer, current signalingState:', {
        signalingState: this.peerConnection.signalingState,
        connectionState: this.peerConnection.connectionState,
        iceConnectionState: this.peerConnection.iceConnectionState,
        room_id,
      });

      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(sdp),
      );

       console.log('[WebRTC] Remote description set from answer — flushing ICE');
       await this._flushICECandidates();

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
    if (!this.localStream) {
      return false;
    }
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (!audioTrack) {
      return false;
    }

    const newState = !audioTrack.enabled;
    audioTrack.enabled = newState;
    InCallManager.setMicrophoneMute(!newState);
    this.emitState('connected');
    return !newState;
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
      // Do NOT reconnect if we already have a working remote stream
      if (this.remoteStreamReceived && this.remoteStream) {
        console.log(
          '[WebRTC] _attemptReconnect SKIPPED - remote stream already received',
        );
        return;
      }

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

    // Minimal PC handling: only recreate/close when PC is actually closed.
    if (this.peerConnection) {
      const state = this.peerConnection.connectionState;
      if (state === 'closed') {
        this.peerConnection.close();
      }
      this.peerConnection = null;
      this.isPeerConnectionReady = false;
    }

    this.pendingICECandidates = [];
    this._resetSignalingGuards();
    await this.getLocalStream();
    this._createPeerConnection();
  }

  cleanup(stopAudio: boolean = true) {
    this._resetSignalingGuards();

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
    this.remoteStreamReceived = false;
    this.connectionEstablishedTime = 0;

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

  console.log('[WebRTC] Registering listeners once');
  console.log('[WebRTC] Removing existing listeners first');

  const currentSocketId = socket.id;

  // After a genuine disconnect the module-level `lastSocketId` is stale (null
  // or points to the old socket instance).  A null-mismatch means listeners
  // have not been bound to this fresh socket yet — reset the flags and
  // proceed to (re)register.
  if (listenersSetup && lastSocketId !== currentSocketId) {
    listenersSetup = false;
  }

  if (listenersSetup && lastSocketId === currentSocketId) {
    return;
  }

  lastSocketId = currentSocketId ?? null;
  listenersSetup = true;

  (socket as any).off('peer_joined');
  (socket as any).off('offer');
  (socket as any).off('answer');
  (socket as any).off('ice-candidate');

  const svc = getWebRTCService();

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

  (socket as any).on('answer', async (data: any) => {
    try {
      console.log('[SIGNALING] answer socket EVENT received:', {
        room_id: data.room_id,
      });
      await svc.handleAnswer({
        sdp: data.answer,
        room_id: data.room_id,
      });
      console.log('[SIGNALING] answer handler complete');
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

  // ── Incoming offer listener (callee side) ────────────────────────────────

  // Receives the caller's SDP offer when the callee's PC already exists and
  // is waiting for the remote description.  handleOffer() creates the answer
  // and emits it back via the 'answer' socket event.
  (socket as any).on('offer', async (data: any) => {
    try {
      console.log('[SIGNALING] offer socket EVENT received:', {
        room_id: data.room_id,
      });
      await svc.handleOffer({
        sdp: data.offer,
        callId: data.callId || '',
        callerId: data.callerId || '',
      });
      console.log('[SIGNALING] offer handler complete');
    } catch (error) {
      console.error('[WebRTC] handleOffer failed:', error);
    }
  });
};
