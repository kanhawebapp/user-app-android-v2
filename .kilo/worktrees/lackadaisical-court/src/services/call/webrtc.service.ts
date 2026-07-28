// import {
//   MediaStream,
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   mediaDevices,
// } from 'react-native-webrtc';
// import {
//   CallState,
//   CallConfig,
//   DEFAULT_CALL_CONFIG,
//   CallRequestData,
// } from './call.types';
// import {socketService} from '../socket/socket.service';
// import {useCallStore} from './call.store';

// const ICE_CONFIG: CallConfig = {
//   iceServers: [
//     {urls: 'stun:stun.l.google.com:19302'},
//     {urls: 'stun:stun1.l.google.com:19302'},
//     {urls: 'stun:stun2.l.google.com:19302'},
//     {
//       urls: 'turn:openrelay.metered.ca:80',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },
//     {
//       urls: 'turn:openrelay.metered.ca:443',
//       username: 'openrelayproject',
//       credential: 'openrelayproject',
//     },
//   ],
//   iceCandidatePoolSize: 10,
//   bundlePolicy: 'max-bundle' as any,
//   rtcpMuxPolicy: 'require' as any,
// };

// class WebRTCService {
//   private peerConnection: RTCPeerConnection | null = null;
//   private localStream: MediaStream | null = null;
//   private remoteStream: MediaStream | null = null;
//   private config: CallConfig = ICE_CONFIG;
//   private onStateChange?: (state: CallState) => void;
//   private callId: string | null = null;
//   private callerId: string | null = null;
//   private calleeId: string | null = null;
//   private roomId: string | null = null;
//   private pendingICECandidates: Array<{candidate: string; sdpMid: string | null; sdpMLineIndex: number | null}> = [];
//   private isFrontCamera: boolean = true;

//   constructor(config: CallConfig = DEFAULT_CALL_CONFIG) {
//     this.config = ICE_CONFIG;
//   }

//   setConfig(config: CallConfig) {
//     this.config = config;
//   }

//   setCallInfo(data: {callId: string; callerId: string; calleeId: string; roomId: string}) {
//     this.callId = data.callId;
//     this.callerId = data.callerId;
//     this.calleeId = data.calleeId;
//     this.roomId = data.roomId;
//   }

//   setStateCallback(callback: (state: CallState) => void) {
//     this.onStateChange = callback;
//   }

//   emitState(
//     status: CallState['status'],
//     partial: Partial<Omit<CallState, 'status'>> = {},
//   ) {
//     const audioTrack = this.localStream?.getAudioTracks()[0];
//     const isMuted = audioTrack ? !audioTrack.enabled : false;
//     this.onStateChange?.({
//       callId: this.callId,
//       callerId: this.callerId,
//       calleeId: this.calleeId,
//       roomId: this.roomId || null,
//       participant: partial.participant || null,
//       status,
//       localStream: this.localStream,
//       remoteStream: this.remoteStream,
//       isMuted,
//       isSpeakerOn: true,
//       isFrontCamera: this.isFrontCamera,
//       callDuration: 0,
//       error: partial.error || null,
//     });
//   }

//   async requestPermissions(): Promise<boolean> {
//     try {
//       await mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//         },
//         video: true,
//       });
//       return true;
//     } catch (error) {
//       console.error('[WebRTC] Permission error:', error);
//       this.emitState('ended', {error: 'Camera/Mic permission denied'});
//       return false;
//     }
//   }

//    async getLocalStream(front: boolean = true): Promise<MediaStream> {
//       try {
//         console.log('[WebRTC] Requesting getUserMedia');

//         const stream = await mediaDevices.getUserMedia({
//           audio: {
//             echoCancellation: true,
//             noiseSuppression: true,
//             autoGainControl: true,
//           },
//           video: {
//             facingMode: front ? 'user' : 'environment',
//             width: {ideal: 640},
//             height: {ideal: 480},
//           } as any,
//         });

//         console.log(
//           '[WebRTC] getUserMedia SUCCESS',
//           {
//             audioTracks: stream.getAudioTracks().length,
//             tracks: stream.getTracks().length,
//           },
//         );

//         this.localStream = stream;

//         // Safely add tracks only if not already added
//         if (this.peerConnection) {
//           this.addTracksToPeerConnection(stream);
//         }

//         console.log(
//           '[WebRTC] Local stream obtained',
//         );

//         return stream;
//       } catch (error) {
//         console.error(
//           '[WebRTC] getUserMedia FAILED',
//           error,
//         );

//         throw error;
//       }
//     }

//    private addTracksToPeerConnection(stream: MediaStream): void {
//       if (!this.peerConnection) {
//         console.log('[WebRTC] No peer connection, skipping track addition');
//         return;
//       }

//       const existingSenders = this.peerConnection.getSenders();

//       stream.getTracks().forEach(track => {
//         const alreadyAdded = existingSenders.find(
//           sender => sender.track?.id === track.id,
//         );

//         if (alreadyAdded) {
//           console.log(
//             '[WebRTC] Track already added, skipping:',
//             track.kind,
//           );
//           return;
//         }

//         console.log(
//           '[WebRTC] Adding local track:',
//           track.kind,
//         );

//         this.peerConnection.addTrack(
//           track,
//           stream,
//         );
//       });

//       console.log(
//         '[WebRTC] Local stream tracks processed',
//       );
//     }

//   createPeerConnection(): RTCPeerConnection {
//     if (this.peerConnection) {
//       return this.peerConnection;
//     }

//     const pc = new RTCPeerConnection(this.config);

// (pc as any).onicecandidate = (event: any) => {
//        if (event.candidate && this.callId) {
//          const candidate = {
//            candidate: event.candidate.candidate,
//            sdpMid: event.candidate.sdpMid,
//            sdpMLineIndex: event.candidate.sdpMLineIndex,
//          };
//          console.log('[WebRTC] Sending ICE candidate:', candidate);
//          const icePayload = {
//            roomId: this.roomId,
//            candidate: candidate,
//          };
//          console.log('[SOCKET EMIT] ice-candidate payload:', icePayload);
//          socketService.emit('ice-candidate', icePayload);
//        }
//      };

//     (pc as any).ontrack = (event: any) => {
//       console.log('[WebRTC] ontrack fired, streams:', event.streams);
//       if (!this.remoteStream) {
//         this.remoteStream = new MediaStream();
//       }
//       this.remoteStream.addTrack(event.track);
//       this.emitState('connected');
//     };

//     (pc as any).oniceconnectionstatechange = () => {
//       const state = pc.iceConnectionState;
//       console.log('[WebRTC] ICE connection state:', state);
//       if (state === 'failed' || state === 'disconnected') {
//         this.emitState('ended', {error: 'Connection lost'});
//       }
//     };

//     (pc as any).onconnectionstatechange = () => {
//       const state = pc.connectionState;
//       console.log('[WebRTC] Connection state:', state);
//     };

//     (pc as any).onsignalingstatechange = () => {
//       console.log('[WebRTC] Signaling state:', pc.signalingState);
//     };

//     (pc as any).onicegatheringstatechange = () => {
//       console.log('[WebRTC] ICE gathering state:', pc.iceGatheringState);
//     };

//     this.peerConnection = pc;
//     return pc;
//   }

//   async startCall(request: CallRequestData): Promise<void> {
//     try {
//       this.callId = request.callId;
//       this.callerId = request.callerId;
//       this.calleeId = request.calleeId;
//       this.roomId = request.roomId;
//     } catch (error: any) {
//       console.error('[WebRTC] Start call error:', error);
//       this.cleanup();
//       this.emitState('ended', {error: error.message || 'Failed to start call'});
//     }
//   }

//   async startCallAsCaller(request: CallRequestData): Promise<void> {
//     try {
//       console.log('[WebRTC] startCallAsCaller - request:', JSON.stringify(request, null, 2));
//       console.log('[WebRTC] Current roomId:', this.getRoomId());

//       if (!request.roomId) {
//         console.error('[USER CALL] roomId missing before join_call emit');
//         return;
//       }

//       this.callId = request.callId;
//       this.callerId = request.callerId;
//       this.calleeId = request.calleeId;
//       this.roomId = request.roomId;
//       console.log('[WebRTC] roomId set:', this.roomId);
//       console.log('[WebRTC] Current roomId after set:', this.getRoomId());

//       // Step 1: Emit join_call
//       console.log('[USER CALL] Joining room');
//       const payload = {roomId: request.roomId};
//       console.log('[SOCKET EMIT] join_call payload:', payload);
//       socketService.emit('join_call', payload);
//       console.log('[SOCKET EMIT] join_call emitted');

//       // Step 2: Listen for peer_joined
//       console.log('[USER CALL] Waiting for peer_joined...');
//       this.emitState('calling', {
//         participant: {
//           id: request.callerId,
//           name: request.callerName || '',
//           image: request.callerImage || '',
//         },
//       });
//     } catch (error: any) {
//       console.error('[WebRTC] Start call as caller error:', error);
//       this.cleanup();
//       this.emitState('ended', {error: error.message || 'Failed to start call'});
//     }
//   }

//    async handlePeerJoined(request: CallRequestData): Promise<void> {
//      try {
//        console.log('[WebRTC] handlePeerJoined START');
//        console.log('[WebRTC] handlePeerJoined - request:', JSON.stringify(request, null, 2));
//        console.log('[WebRTC] Current roomId:', this.getRoomId());
//        console.log('[WebRTC] this:', this);
//        console.log('[WebRTC] this.peerConnection:', this.peerConnection);

//        if (this.peerConnection) {
//          console.log(
//            '[WebRTC] Peer connection already exists, skipping duplicate peer_joined',
//          );
//          return;
//        }

//        console.log('[WebRTC] Creating peer connection');
//        this.createPeerConnection();
//        console.log('[WebRTC] Peer connection created:', !!this.peerConnection);

//        // Step 4: Get local stream
//        console.log('[WebRTC] Getting local stream');
//        const stream = await this.getLocalStream(true);
//        console.log('[WebRTC] Local stream obtained successfully');
//        console.log('[WebRTC] Stream tracks:', stream.getTracks().length);

//        // Update store with local stream and status
//        useCallStore.setState({
//          status: 'creating_offer',
//          localStream: this.localStream,
//        });
//        console.log('[WebRTC] Store updated with localStream, status=creating_offer');

//         // Step 6: Create offer
//         console.log('[WebRTC] Creating offer');
//         const offer = await this.peerConnection!.createOffer({
//           offerToReceiveAudio: true,
//           offerToReceiveVideo: false,
//         });
//         console.log('[WebRTC] Offer created');

//         useCallStore.setState({
//           status: 'sending_offer',
//         });
//         console.log('[WebRTC] Store updated status=sending_offer');

//         // Step 7: Set local description
//         console.log('[WebRTC] Setting local description');
//         await this.peerConnection!.setLocalDescription(offer);
//         console.log('[WebRTC] Local description set');

//         // Step 8: Emit offer
//         console.log('[WebRTC] Emitting offer');
//         const offerPayload = {
//           room_id: this.roomId,
//           offer: {
//             type: offer.type,
//             sdp: offer.sdp,
//           },
//         };
//         console.log('[SOCKET EMIT] offer payload:', offerPayload);
//         const emitResult = socketService.emit('offer', offerPayload);
//         console.log('[SOCKET EMIT] offer emitted, success:', emitResult);

//         useCallStore.setState({
//           status: 'waiting_answer',
//         });
//         console.log('[WebRTC] Store updated status=waiting_answer');

//         console.log('[WebRTC] handlePeerJoined END - SUCCESS');
//      } catch (error: any) {
//        console.error('[WebRTC] Handle peer joined error:', error);
//        this.cleanup();
//        this.emitState('ended', {
//          error: error.message || 'Failed to create offer',
//        });
//      }
//    }

//        console.log('[WebRTC] handlePeerJoined - Creating peer connection');
//        this.createPeerConnection();

//        // Step 4: Get local stream
//        console.log('[WebRTC] handlePeerJoined - Getting local stream');
//        const stream = await this.getLocalStream(true);
//        console.log('[WebRTC] Local stream obtained successfully');

//        // Update store with local stream and status
//        useCallStore.setState({
//          status: 'creating_offer',
//          localStream: this.localStream,
//        });

//         // Step 6: Create offer
//         console.log('[WebRTC] handlePeerJoined - Creating offer');
//         const offer = await this.peerConnection!.createOffer({
//           offerToReceiveAudio: true,
//           offerToReceiveVideo: false,
//         });
//         console.log('[WebRTC] Offer created');

//         useCallStore.setState({
//           status: 'sending_offer',
//         });

//         // Step 7: Set local description
//         console.log('[WebRTC] handlePeerJoined - Setting local description');
//         await this.peerConnection!.setLocalDescription(offer);
//         console.log('[WebRTC] Local description set');

//         // Step 8: Emit offer
//         console.log('[SOCKET EMIT] Sending offer');
//         const offerPayload = {
//           room_id: this.roomId,
//           offer: {
//             type: offer.type,
//             sdp: offer.sdp,
//           },
//         };
//         console.log('[SOCKET EMIT] offer payload:', offerPayload);
//         socketService.emit('offer', offerPayload);
//         console.log('[SOCKET EMIT] offer emitted');

//         useCallStore.setState({
//           status: 'waiting_answer',
//         });
//      } catch (error: any) {
//        console.error('[WebRTC] Handle peer joined error:', error);
//        this.cleanup();
//        this.emitState('ended', {
//          error: error.message || 'Failed to create offer',
//        });
//      }
//    }

//   async acceptCall(request: CallRequestData): Promise<void> {
//     try {
//       this.callId = request.callId;
//       this.callerId = request.callerId;
//       this.calleeId = request.calleeId;
//       this.roomId = request.roomId;

//       await this.requestPermissions();
//       const stream = await this.getLocalStream(true);

//       this.createPeerConnection();

//       socketService.emit('webrtc_call_accepted', {
//         callId: this.callId,
//         calleeId: this.calleeId,
//       } as any);

//       this.emitState('connecting', {
//         participant: {
//           id: request.callerId,
//           name: request.callerName,
//           image: request.callerImage,
//         },
//       });
//     } catch (error: any) {
//       console.error('[WebRTC] Accept call error:', error);
//       this.cleanup();
//       socketService.emit('webrtc_call_rejected', {
//         callId: this.callId,
//       } as any);
//       this.emitState('ended', {
//         error: error.message || 'Failed to accept call',
//       });
//     }
//   }

//   async handleOffer({
//     sdp,
//     callId,
//     callerId,
//   }: {
//     sdp: RTCSessionDescription;
//     callId: string;
//     callerId: string;
//   }) {
//     try {
//       console.log('[WebRTC] handleOffer - received sdp:', sdp);
//       console.log('[WebRTC] Current roomId:', this.getRoomId());

//       this.callId = callId;
//       this.callerId = callerId;

//       await this.peerConnection?.setRemoteDescription(
//         new RTCSessionDescription(sdp),
//       );

//       const queued = this.pendingICECandidates;
//       this.pendingICECandidates = [];
//       for (const ice of queued) {
//         await this.peerConnection?.addIceCandidate(
//           new RTCIceCandidate({
//             candidate: ice.candidate,
//             sdpMid: ice.sdpMid,
//             sdpMLineIndex: ice.sdpMLineIndex,
//           }),
//         );
//       }

//       const answer = await this.peerConnection!.createAnswer();
//       await this.peerConnection!.setLocalDescription(answer);

//       const answerPayload = {
//         room_id: this.roomId,
//         answer: {
//           type: answer.type,
//           sdp: answer.sdp,
//         },
//       };
//       console.log('[SOCKET EMIT] answer payload:', answerPayload);
//       socketService.emit('answer', answerPayload);
//       console.log('[SOCKET EMIT] answer emitted');
//     } catch (error) {
//       console.error('[WebRTC] Handle offer error:', error);
//     }
//   }

//    async handleAnswer({
//      sdp,
//      room_id,
//    }: {
//      sdp: RTCSessionDescription;
//      room_id: string;
//    }) {
//      try {
//        console.log('[WebRTC] handleAnswer - received sdp:', sdp);
//        console.log('[WebRTC] handleAnswer - room_id:', room_id);
//        console.log('[WebRTC] Current roomId:', this.getRoomId());

//        await this.peerConnection?.setRemoteDescription(
//          new RTCSessionDescription(sdp),
//        );
//        console.log('[WebRTC] Remote description set');

//        useCallStore.setState({
//          status: 'connected',
//        });

//        const queued = this.pendingICECandidates;
//        this.pendingICECandidates = [];
//        for (const ice of queued) {
//          await this.peerConnection?.addIceCandidate(
//            new RTCIceCandidate({
//              candidate: ice.candidate,
//              sdpMid: ice.sdpMid,
//              sdpMLineIndex: ice.sdpMLineIndex,
//            }),
//          );
//        }

//        this.emitState('connected');
//      } catch (error) {
//        console.error('[WebRTC] Handle answer error:', error);
//      }
//    }

//   async handleIceCandidate({
//     candidate,
//     room_id,
//   }: {
//     candidate: {candidate: string; sdpMid: string | null; sdpMLineIndex: number | null};
//     room_id: string;
//   }) {
//     try {
//       console.log('[WebRTC] handleIceCandidate - received:', JSON.stringify(candidate, null, 2));
//       console.log('[WebRTC] handleIceCandidate - room_id:', room_id);

//       if (this.peerConnection?.remoteDescription) {
//         await this.peerConnection.addIceCandidate(
//           new RTCIceCandidate(candidate),
//         );
//         console.log('[WEBSOCKET] ICE candidate added');
//       } else {
//         this.pendingICECandidates.push(candidate);
//         console.log('[WEBSOCKET] ICE candidate queued, pending count:', this.pendingICECandidates.length);
//       }
//     } catch (error) {
//       console.error('[WebRTC] Add ICE candidate error:', error);
//     }
//   }

//   toggleMute(): boolean {
//     if (!this.localStream) {
//       return false;
//     }
//     const audioTrack = this.localStream.getAudioTracks()[0];
//     if (audioTrack) {
//       audioTrack.enabled = !audioTrack.enabled;
//       this.emitState('connected');
//       return !audioTrack.enabled;
//     }
//     return false;
//   }

//   async switchCamera(): Promise<boolean> {
//     if (!this.localStream || !this.peerConnection) {
//       return false;
//     }
//     try {
//       const videoTrack = this.localStream.getVideoTracks()[0];
//       if (!videoTrack) {
//         return false;
//       }

//       const settings = videoTrack.getSettings() as any;
//       const isFront = settings.facingMode === 'user';
//       const newStream = await this.getLocalStream(!isFront);
//       const newVideoTrack = newStream.getVideoTracks()[0];

//       const sender = this.peerConnection
//         .getSenders()
//         .find(s => s.track?.kind === 'video');
//       if (sender) {
//         sender.replaceTrack(newVideoTrack);
//       }

//       videoTrack.stop();
//       this.localStream.removeTrack(videoTrack);
//       this.localStream.addTrack(newVideoTrack);

//       return true;
//     } catch (error) {
//       console.error('[WebRTC] Switch camera error:', error);
//       return false;
//     }
//   }

//   async endCall(): Promise<void> {
//     console.log('[Call] User ending call');
//     if (this.callId) {
//       console.log('[Call] Emitting call_ended_by_user');
//       const endPayload = {room_id: this.roomId || this.callId};
//       console.log('[SOCKET EMIT] call_ended_by_user payload:', endPayload);
//       socketService.emit('call_ended_by_user', endPayload as any);
//       // Also emit legacy event for compatibility
//       socketService.emit('webrtc_call_end', {callId: this.callId} as any);
//     }
//     this.cleanup();
//     console.log('[Call] Cleanup completed');
//     this.emitState('ended');
//   }

//   rejectCall(): void {
//     console.log('[Call] User rejecting call');
//     if (this.callId) {
//       console.log('[Call] Emitting call_ended_by_user (reject)');
//       const rejectPayload = {room_id: this.roomId || this.callId};
//       console.log('[SOCKET EMIT] call_ended_by_user (reject) payload:', rejectPayload);
//       socketService.emit('call_ended_by_user', rejectPayload as any);
//       // Also emit legacy event for compatibility
//       socketService.emit('webrtc_call_rejected', {callId: this.callId} as any);
//     }
//     this.cleanup();
//     console.log('[Call] Cleanup completed');
//     this.emitState('rejected');
//   }

//   public cleanup() {
//     console.log('[WebRTC] cleanup resetting roomId');
//     this.localStream?.getTracks().forEach(track => track.stop());
//     this.localStream = null;
//     this.remoteStream = null;
//     this.peerConnection?.close();
//     this.peerConnection = null;
//     this.callId = null;
//     this.callerId = null;
//     this.calleeId = null;
//     this.roomId = null;
//     this.pendingICECandidates = [];
//   }

//   getLocalStreamValue(): MediaStream | null {
//     return this.localStream;
//   }

//   getRemoteStreamValue(): MediaStream | null {
//     return this.remoteStream;
//   }

//   getCallId(): string | null {
//     return this.callId;
//   }

//   getCallerId(): string | null {
//     return this.callerId;
//   }

//   getCalleeId(): string | null {
//     return this.calleeId;
//   }

//   getRoomId(): string | null {
//     return this.roomId;
//   }
// }

// export const webRTCService = new WebRTCService();

// let listenersSetup = false;

// export const setupWebRTCListeners = () => {
//   if (listenersSetup) {
//     console.log('[WebRTC] setupWebRTCListeners - already setup, skipping duplicate');
//     return;
//   }

//   const socket = socketService.getSocket();
//   if (!socket) {
//     console.log('[WebRTC] No socket available for setting up listeners');
//     return;
//   }

//   console.log('[WebRTC] setupWebRTCListeners - setting up listeners');
//   console.log('[WebRTC] webRTCService instance:', webRTCService);
//   listenersSetup = true;

//   (socket as any).off('offer');
//   (socket as any).off('answer');
//   (socket as any).off('ice-candidate');
//   (socket as any).off('peer_joined');

//   (socket as any).on(
//     'peer_joined',
//     async (eventData) => {
//       try {
//         console.log(
//           '[WebRTC] peer_joined received',
//           eventData,
//         );

//         console.log(
//           '[WebRTC] webRTCService instance:',
//           webRTCService,
//         );

//         console.log(
//           '[WebRTC] Current roomId:',
//           webRTCService.getRoomId(),
//         );

//         console.log(
//           '[WebRTC] Current peerConnection:',
//           webRTCService['peerConnection'],
//         );

//         if (webRTCService['peerConnection']) {
//           console.log(
//             '[WebRTC] Existing peerConnection found, skipping duplicate peer_joined',
//           );
//           return;
//         }

//         console.log(
//           '[WebRTC] Calling handlePeerJoined...',
//         );

//         await webRTCService.handlePeerJoined({
//           callId: webRTCService.getCallId() || '',
//           callerId: webRTCService.getCallerId() || '',
//           calleeId: webRTCService.getCalleeId() || '',
//           roomId: webRTCService.getRoomId() || '',
//           callerName: '',
//           callerImage: '',
//         });

//         console.log(
//           '[WebRTC] handlePeerJoined COMPLETED',
//         );
//       } catch (error) {
//         console.error(
//           '[WebRTC] peer_joined listener FAILED',
//           error,
//         );
//       }
//     },
//   );

//   (socket as any).on('answer', (data: any) => {
//     console.log('[WebRTC] Received answer:', JSON.stringify(data, null, 2));
//     webRTCService.handleAnswer({
//       sdp: data.answer,
//       room_id: data.room_id,
//     });
//   });

//   (socket as any).on('ice-candidate', (data: any) => {
//     console.log('[WebRTC] Received ICE candidate:', JSON.stringify(data, null, 2));
//     webRTCService.handleIceCandidate({
//       candidate: data.candidate,
//       room_id: data.room_id,
//     });
//   });
// };
