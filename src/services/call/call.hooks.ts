// import { useCallback, useEffect, useRef } from 'react';
// import { Platform } from 'react-native';

// import { useCallStore } from './call.store';
// import { webRTCService, setupWebRTCListeners } from './webrtc.service';
// import { signalingService } from './signaling.service';
// import { CallRequestData } from './call.types';
// import { socketService } from '../socket/socket.service';
// import InCallManager from 'react-native-incall-manager';
// import { SOCKET_EVENTS } from '../socket/socket.events';
// import { useNavigation } from '@react-navigation/native';
// import { useChatStore } from '../chat/chat.store';
// import { callTimerService } from './call.timer';

// const stopRingbackSafely = () => {
//   try {
//     InCallManager.stopRingback();
//     InCallManager.stop();
//     console.log('[Ringback] stopped safely');
//   } catch (e) {
//     console.log('[Ringback] stop error', e);
//   }
// };

// export const useCall = () => {
//     const {
//       status,
//       localStream,
//       remoteStream,
//       isMuted,
//       participant,
//       callId,
//       setMuted,
//       setStatus,
//       setCallDurationRemaining,
//       resetCallTimer,
//       roomId
//     } = useCallStore();

//     const peerJoinedReceived = useRef(false);
//     const callEndedInProgressRef = useRef(false);
//     const userPayload = useChatStore(state => state.userPayload);

//     const navigation = useNavigation();

//     // Initialize the call timer service
//     const startCountdown = (seconds: number) => callTimerService.startCountdown(seconds);
//     const stopCountdown = () => callTimerService.stopCountdown();
//     const resetCountdown = () => callTimerService.resetCountdown();
//     const isRunning = callTimerService.isRunning();

//     useEffect(() => {
//       // Register WebRTC socket listeners (answer, ice-candidate, peer_joined)
//       // This MUST happen before any emit calls
//       setupWebRTCListeners();

//       webRTCService.setStateCallback(state => {
//         useCallStore.setState({
//           localStream: state.localStream,
//           remoteStream: state.remoteStream,
//           isMuted: state.isMuted,
//           error: state.error,
//           status: state.status,
//         });
//         if (state.status === 'connected') {
//           stopRingbackSafely();
//         }
//       });

//       // Register callbacks - note: onCallAccepted is intentionally a no-op
//       // because we handle call acceptance via 'callAcceptedByAstrologer' directly in startCall
//       signalingService.registerCallbacks({
//         onCallAccepted: () => { }, // Handled directly in startCall
//         onCallRejected: handleCallRejected,
//         onCallEnded: handleCallEnded,
//       });

//       return () => {
//         signalingService.unregisterListeners();
//       };
//     }, []);

//    // ── Countdown ──────────────────────────────────────────────────────────
//     // Starts when status becomes 'connected', uses callDurationRemaining as
//     // the single source of truth. Clears cleanly on end / reject / unmount.

//     useEffect(() => {
//       if (status !== 'connected') return;

//       const { callDurationRemaining } = useCallStore.getState();
//       startCountdown(callDurationRemaining);

//       return () => {
//         stopCountdown();
//       };
//     }, [status]);

//   // ── End-call guard reset ────────────────────────────────────────────────
//   // Reset the guard when a brand-new call flows in (after end → inititated)
//   useEffect(() => {
//     if (status === 'initiated' && callEndedInProgressRef.current) {
//       callEndedInProgressRef.current = false;
//     }
//   }, [status]);

//   const autoCallReject = (room_id: any, astro_id: any) => {
//     return socketService.emit('autodisconnect', {
//       room_id,
//       astroid: astro_id,
//       type: 'call',
//     });
//   };

//   // ── Unified call cleanup ────────────────────────────────────────────────
//     // Single source of truth for end / reject / remote-end.  All three paths
//     // below call this so nothing is ever missed.
//   const performCallCleanup = useCallback(() => {
//       callEndedInProgressRef.current = true;

//       // Stop the live countdown
//       stopCountdown();

//       // Hang up / stop ringback / audio session
//       stopRingbackSafely();
//       webRTCService.cleanup();

//       // Fully reset the service store (clears participant, callId, streams, …)
//       useCallStore.getState().reset();
//   }, []);

//   // ── Rejected ─────────────────────────────────────────────────────────────
//   const handleCallRejected = useCallback(
//     (data: { callId: string; reason?: string }) => {
//       performCallCleanup();
//       webRTCService.emitState('rejected', {
//         error: data.reason || 'Call rejected',
//       });
//     },
//     [performCallCleanup],
//   );

//   // ── Remote / astrologer ended ────────────────────────────────────────────
//   const handleCallEnded = useCallback(() => {
//     performCallCleanup();
//     // optional safety broadcast
//     webRTCService.emitState('ended');
//   }, [performCallCleanup]);

//   const startCall = useCallback(
//     async (data: CallRequestData) => {
//       try {
//         peerJoinedReceived.current = false;

//         console.log('[Call Hook] Starting call as caller');
//         console.log('[Call Hook] Call data:', {
//           callId: data.callId,
//           room_id: data.room_id,
//           callerId: data.callerId,
//           calleeId: data.calleeId,
//         });

//         // Set initial UI state to 'calling'
//         useCallStore.setState({
//           status: 'calling',
//         });
//         // ADDED FOR RINGBACK
//         stopRingbackSafely();
//         InCallManager.startRingback();
//         console.log('[Ringback] started');

//         // Validation
//         if (!data.room_id) {
//           console.error('[USER CALL] room_id missing before join_call emit');
//           return;
//         }

//         // Store call info in the service FIRST
//         webRTCService.setCallInfo({
//           callId: data.callId,
//           callerId: data.callerId,
//           calleeId: data.calleeId,
//           room_id: data.room_id,
//         });

//         console.log(
//           '[WebRTC] Current room_id after setCallInfo:',
//           webRTCService.getRoomId(),
//         );

//         // Store call info in the store
//         useCallStore.setState({
//           callId: data.callId,
//           callerId: data.callerId,
//           calleeId: data.calleeId,
//           roomId: data.room_id as any,
//           participant: {
//             id: data.calleeId,
//             name: data.callerName || 'Astrologer',
//             image: data.callerImage || '',
//           },
//         });

//         // Make sure socket is connected BEFORE registering listeners
//         console.log('[USER CALL] Checking socket connection...');
//         let socket = socketService.getSocket();
//         if (!socket || !socket.connected) {
//           console.log('[USER CALL] Socket not connected, connecting...');
//           socket = await socketService.connectAndWait();
//           if (!socket) {
//             throw new Error('Socket connection failed');
//           }
//           console.log('[USER CALL] Socket connected:', socket.id);
//         }

//         if (!socket) {
//           throw new Error('Socket is null');
//         }

//         // Listen for callAcceptedByAstrologer - join_call ONLY after astrologer accepts
//         (socket as any).off('callAcceptedByAstrologer');

//         const onAccepted = async (eventData: any) => {
//           console.log(
//             '[USER CALL] callAcceptedByAstrologer received',
//             eventData,
//           );

//           const normalizedRoomId = eventData?.room_id || eventData?.roomId;

//           console.log('[SIGNAL NORMALIZED ROOM]', {
//             event: 'callAcceptedByAstrologer',
//             room_id: eventData?.room_id,
//             roomId: eventData?.roomId,
//             normalizedRoomId,
//           });

//           if (!normalizedRoomId) {
//             console.log('[USER CALL] Missing room_id');
//             return;
//           }

//           // Save callTime (seconds) from server — single source of truth for countdown
//           const callTime = Number(
//             eventData?.callTime ?? eventData?.call_time ?? 0,
//           );
//           setCallDurationRemaining(callTime);
//           console.log(
//             '[Timer] callDurationRemaining set from callAccepted:',
//             callTime,
//           );

//           useCallStore.setState({
//             status: 'connecting',
//           });
//           // ADDED FOR RINGBACK
//           stopRingbackSafely();
//           console.log('[USER CALL] Status changed to connecting');

//           // ✅ FIX
//           socket.emit('join_call', {
//             roomId: normalizedRoomId,
//           });

//           console.log('[SOCKET EMIT] join_call emitted', normalizedRoomId);
//         };

//         (socket as any).once('callAcceptedByAstrologer', onAccepted);
//         } catch (error: any) {
//           console.error('[Call Hook] Start call error:', error);
//           stopRingbackSafely();
//           // Stop the timer if it's running
//           stopCountdown();
//           webRTCService.emitState('ended', {
//             error: error.message || 'Failed to start call',
//           });
//         }
//     },
//     [setCallDurationRemaining],
//   );

//   const acceptCall = useCallback(async (data: CallRequestData) => {
//     try {
//       await webRTCService.acceptCall(data);
//     } catch (error: any) {
//       console.error('[Call] Accept call error:', error);
//       webRTCService.emitState('ended', {
//         error: error.message || 'Failed to accept call',
//       });
//     }
//   }, []);

//   const rejectCall = useCallback(() => {
//     performCallCleanup();
//     webRTCService.emitState('rejected', {
//       error: 'Call rejected',
//     });
//   }, [performCallCleanup]);

//   // const cancelCallRequest = useCallback(async (roomIdd: any, astroId: any) => {
//   //   try {
//   //     performCallCleanup();

//   //     const socket = socketService.getSocket();
//   //     const roomId =
//   //       useCallStore.getState().roomId || webRTCService.getRoomId();
//   //     console.log('i am here in end call', status);

//   //     socket?.emit('cancel_call_request', {
//   //       room_id: roomIdd,
//   //       astroid: astroId,
//   //       user_id: useCallStore.getState().callerId,
//   //       type: 'call',
//   //     });
//   //   } catch (error) {
//   //     console.error('[CALL END ERROR]', error);
//   //     stopRingbackSafely();
//   //   }
//   // }, [performCallCleanup]);

//   const cancelCallRequest = useCallback(async ({ roomId, astroId, userId }: { roomId: any; astroId: any; userId: any }) => {
//     try {
//       console.log('cancelling call request with roomId:', roomId, 'and astroId:', astroId);

//       // 1. Update local state and cleanup
//       webRTCService.emitState('ended');

//       // 2. Cleanup
//       performCallCleanup();

//       // 3. Server emit
//       const socket = socketService.getSocket();
//       console.log('i am here in cancel call request');
//       const payload = {
//         room_id: roomId,
//         astroid: astroId,
//         user_id: userId,
//         type: 'call',
//       };
//       console.log('emitting cancel_call_request with payload:', payload);
//       socket?.emit('cancel_call_request', payload);
//       console.log("call cancel succeed, navigating back");
//       if (navigation.canGoBack()) {
//         navigation.goBack();
//       }
//     } catch (error) {
//       console.error('[CALL CANCEL ERROR]', error);
//       stopRingbackSafely();
//     }
//   }, [performCallCleanup]);

//   const endCall = useCallback(async ({ roomId, astroId }: { roomId: any; astroId: any }) => {
//     try {
//       performCallCleanup();
//       const socket = socketService.getSocket();
//       console.log('i am here in end call', status);
//       socket?.emit('call_ended_by_user', {
//         room_id: roomId,
//         astro_id: astroId,
//       });
//     } catch (error) {
//       console.error('[CALL END ERROR]', error);
//       stopRingbackSafely();
//     }
//   }, [performCallCleanup]);

//   const toggleMute = useCallback(() => {
//     const muted = webRTCService.toggleMute();
//     setMuted(muted);
//   }, [setMuted]);

//   return {
//     status,
//     localStream,
//     remoteStream,
//     isMuted,
//     participant,
//     callId,
//     startCall,
//     acceptCall,
//     rejectCall,
//     endCall,
//     toggleMute,
//     cancelCallRequest,
//     autoCallReject,
//   };
// };

import {useCallback, useEffect, useRef} from 'react';
import {useCallStore} from './call.store';
import {webRTCService, setupWebRTCListeners} from './webrtc.service';
import {signalingService} from './signaling.service';
import {CallRequestData} from './call.types';
import {socketService} from '../socket/socket.service';
import InCallManager from 'react-native-incall-manager';
import {useNavigation} from '@react-navigation/native';
import {useChatStore} from '../chat/chat.store';
import {callTimerService} from './call.timer';
import {resetCallReadyFlag} from './call.queue';

const stopRingbackSafely = () => {
  try {
    InCallManager.stopRingback();
    InCallManager.stop();
    console.log('[Ringback] stopped safely');
  } catch (e) {
    console.log('[Ringback] stop error', e);
  }
};

export const useCall = () => {
  const {
    status,
    localStream,
    remoteStream,
    isMuted,
    participant,
    callId,
    setMuted,
    setStatus,
    setCallDurationRemaining,
    resetCallTimer,
    roomId,
  } = useCallStore();

  const peerJoinedReceived = useRef(false);
  const callEndedInProgressRef = useRef(false);
  const userPayload = useChatStore(state => state.userPayload);

  const navigation = useNavigation();

  // Initialize the call timer service
  const startCountdown = (seconds: number) =>
    callTimerService.startCountdown(seconds);
  const stopCountdown = () => callTimerService.stopCountdown();
  const resetCountdown = () => callTimerService.resetCountdown();
  const isRunning = callTimerService.isRunning();

  useEffect(() => {
    // Register WebRTC socket listeners (answer, ice-candidate, peer_joined)
    // This MUST happen before any emit calls
    setupWebRTCListeners();

    webRTCService.setStateCallback(state => {
      useCallStore.setState({
        localStream: state.localStream,
        remoteStream: state.remoteStream,
        isMuted: state.isMuted,
        error: state.error,
        status: state.status,
      });
      if (state.status === 'connected') {
        stopRingbackSafely();
      }
    });

    // Register callbacks - note: onCallAccepted is intentionally a no-op
    // because we handle call acceptance via 'callAcceptedByAstrologer' directly in startCall
    signalingService.registerCallbacks({
      onCallAccepted: () => {}, // Handled directly in startCall
      onCallRejected: handleCallRejected,
      onCallEnded: handleCallEnded,
    });

    return () => {
      signalingService.unregisterListeners();
    };
  }, []);

  // ── Countdown ──────────────────────────────────────────────────────────
  // Starts when status becomes 'connected', uses callDurationRemaining as
  // the single source of truth. Clears cleanly on end / reject / unmount.

  useEffect(() => {
    if (status !== 'connected') {
      return;
    }

    const {callDurationRemaining} = useCallStore.getState();
    startCountdown(callDurationRemaining);

    return () => {
      stopCountdown();
    };
  }, [status]);

  // ── End-call guard reset ────────────────────────────────────────────────
  // Reset the guard when a brand-new call flows in (after end → inititated)
  useEffect(() => {
    if (status === 'initiated' && callEndedInProgressRef.current) {
      callEndedInProgressRef.current = false;
    }
  }, [status]);

  const autoCallReject = (room_id: any, astro_id: any) => {
    return socketService.emit('autodisconnect', {
      room_id,
      astroid: astro_id,
      type: 'call',
    });
  };

  // ── Unified call cleanup ────────────────────────────────────────────────
  // Single source of truth for end / reject / remote-end.  All three paths
  // below call this so nothing is ever missed.
  const performCallCleanup = useCallback(() => {
    callEndedInProgressRef.current = true;

    // Stop the live countdown
    stopCountdown();

    // Hang up / stop ringback / audio session
    stopRingbackSafely();
    webRTCService.cleanup();

    // Fully reset the service store (clears participant, callId, streams, …)
    useCallStore.getState().reset();
  }, []);

  // ── Rejected ─────────────────────────────────────────────────────────────
  const handleCallRejected = useCallback(
    (data: {callId: string; reason?: string}) => {
      performCallCleanup();
      webRTCService.emitState('rejected', {
        error: data.reason || 'Call rejected',
      });
    },
    [performCallCleanup],
  );

  // ── Remote / astrologer ended ────────────────────────────────────────────
  const handleCallEnded = useCallback(() => {
    performCallCleanup();
    // optional safety broadcast
    webRTCService.emitState('ended');
  }, [performCallCleanup]);

  const startCall = useCallback(
    async (data: CallRequestData) => {
      try {
        peerJoinedReceived.current = false;

        console.log('[Call Hook] Starting call as caller');
        console.log('[Call Hook] Call data:', {
          callId: data.callId,
          room_id: data.room_id,
          callerId: data.callerId,
          calleeId: data.calleeId,
        });

        // Set initial UI state to 'calling'
        useCallStore.setState({
          status: 'calling',
        });
        // ADDED FOR RINGBACK
        stopRingbackSafely();
        InCallManager.startRingback();
        console.log('[Ringback] started');

        // Validation
        if (!data.room_id) {
          console.error('[USER CALL] room_id missing before join_call emit');
          return;
        }

        // Store call info in the service FIRST
        webRTCService.setCallInfo({
          callId: data.callId,
          callerId: data.callerId,
          calleeId: data.calleeId,
          room_id: data.room_id,
        });

        console.log(
          '[WebRTC] Current room_id after setCallInfo:',
          webRTCService.getRoomId(),
        );

        // Store call info in the store
        useCallStore.setState({
          callId: data.callId,
          callerId: data.callerId,
          calleeId: data.calleeId,
          roomId: data.room_id as any,
          participant: {
            id: data.calleeId,
            name: data.callerName || 'Astrologer',
            image: data.callerImage || '',
          },
        });

        // Make sure socket is connected BEFORE registering listeners
        console.log('[USER CALL] Checking socket connection...');
        let socket = socketService.getSocket();
        if (!socket || !socket.connected) {
          console.log('[USER CALL] Socket not connected, connecting...');
          socket = await socketService.connectAndWait();
          if (!socket) {
            throw new Error('Socket connection failed');
          }
          console.log('[USER CALL] Socket connected:', socket.id);
        }

        if (!socket) {
          throw new Error('Socket is null');
        }

        // Listen for callAcceptedByAstrologer - join_call ONLY after astrologer accepts
        (socket as any).off('callAcceptedByAstrologer');

        (socket as any).off('call_rejected_by_astrologer');

        const onRejectedByAstrologer = (eventData: any) => {
          console.log(
            '[USER CALL] call_rejected_by_astrologer received',
            eventData,
          );

          stopRingbackSafely();

          // stop timer
          stopCountdown();

          // cleanup everything
          performCallCleanup();

          // update UI state
          useCallStore.setState({
            status: 'rejected',
            error:
              eventData?.reason ||
              eventData?.message ||
              'Call rejected by astrologer',
          });

          // emit state for UI listeners
          webRTCService.emitState('rejected', {
            error:
              eventData?.reason ||
              eventData?.message ||
              'Call rejected by astrologer',
          });
        };

        (socket as any).once(
          'call_rejected_by_astrologer',
          onRejectedByAstrologer,
        );

        const onAccepted = async (eventData: any) => {
          console.log(
            '[USER CALL] callAcceptedByAstrologer received',
            eventData,
          );

          const normalizedRoomId = eventData?.room_id || eventData?.roomId;

          console.log('[SIGNAL NORMALIZED ROOM]', {
            event: 'callAcceptedByAstrologer',
            room_id: eventData?.room_id,
            roomId: eventData?.roomId,
            normalizedRoomId,
          });

          if (!normalizedRoomId) {
            console.log('[USER CALL] Missing room_id');
            return;
          }

          // Save callTime (seconds) from server — single source of truth for countdown
          const callTime = Number(
            eventData?.callTime ?? eventData?.call_time ?? 0,
          );
          setCallDurationRemaining(callTime);
          console.log(
            '[Timer] callDurationRemaining set from callAccepted:',
            callTime,
          );

          useCallStore.setState({
            status: 'connecting',
          });
          // ADDED FOR RINGBACK
          stopRingbackSafely();
          console.log('[USER CALL] Status changed to connecting');

          // ✅ FIX
          socket.emit('join_call', {
            roomId: normalizedRoomId,
          });

          console.log('[SOCKET EMIT] join_call emitted', normalizedRoomId);
        };

        (socket as any).once('callAcceptedByAstrologer', onAccepted);
      } catch (error: any) {
        console.error('[Call Hook] Start call error:', error);
        stopRingbackSafely();
        // Stop the timer if it's running
        stopCountdown();
        webRTCService.emitState('ended', {
          error: error.message || 'Failed to start call',
        });
      }
    },
    [setCallDurationRemaining],
  );

  const acceptCall = useCallback(async (data: CallRequestData) => {
    try {
      await webRTCService.acceptCall(data);
    } catch (error: any) {
      console.error('[Call] Accept call error:', error);
      webRTCService.emitState('ended', {
        error: error.message || 'Failed to accept call',
      });
    }
  }, []);

  const rejectCall = useCallback(() => {
    performCallCleanup();
    webRTCService.emitState('rejected', {
      error: 'Call rejected',
    });
  }, [performCallCleanup]);

  // const cancelCallRequest = useCallback(async (roomIdd: any, astroId: any) => {
  //   try {
  //     performCallCleanup();

  //     const socket = socketService.getSocket();
  //     const roomId =
  //       useCallStore.getState().roomId || webRTCService.getRoomId();
  //     console.log('i am here in end call', status);

  //     socket?.emit('cancel_call_request', {
  //       room_id: roomIdd,
  //       astroid: astroId,
  //       user_id: useCallStore.getState().callerId,
  //       type: 'call',
  //     });
  //   } catch (error) {
  //     console.error('[CALL END ERROR]', error);
  //     stopRingbackSafely();
  //   }
  // }, [performCallCleanup]);

  const cancelCallRequest = useCallback(
    async ({
      roomId,
      astroId,
      userId,
    }: {
      roomId: any;
      astroId: any;
      userId: any;
    }) => {
      try {
        console.log(
          'cancelling call request with roomId:',
          roomId,
          'and astroId:',
          astroId,
        );

        const callStatus = useCallStore.getState().status;
        const wasQueued =
          callStatus === 'queued' ||
          callStatus === 'queue_checking' ||
          callStatus === 'waiting';

        // Clear independent call queue + signal global handlers to ignore.
        useCallStore.getState().cancelPendingCallQueue();
        resetCallReadyFlag();

        // 1. Update local state and cleanup
        webRTCService.emitState('ended');

        // 2. Cleanup
        performCallCleanup();

        // 3. Server emit
        const socket = socketService.getSocket();
        console.log('i am here in cancel call request');
        const payload = {
          room_id: roomId,
          astroid: astroId,
          user_id: userId,
          type: 'call',
        };
        console.log('emitting cancel_call_request with payload:', payload);
        socket?.emit('cancel_call_request', payload);

        // Queue cancel happens on ChatCall/Home — do not pop navigation.
        if (!wasQueued && navigation.canGoBack()) {
          console.log('call cancel succeed, navigating back');
          navigation.goBack();
        }
      } catch (error) {
        console.error('[CALL CANCEL ERROR]', error);
        stopRingbackSafely();
      }
    },
    [performCallCleanup, navigation],
  );

  const endCall = useCallback(
    async ({roomId, astroId}: {roomId: any; astroId: any}) => {
      try {
        performCallCleanup();
        const socket = socketService.getSocket();
        console.log('i am here in end call', status);
        socket?.emit('call_ended_by_user', {
          room_id: roomId,
          astro_id: astroId,
        });
      } catch (error) {
        console.error('[CALL END ERROR]', error);
        stopRingbackSafely();
      }
    },
    [performCallCleanup],
  );

  const toggleMute = useCallback(() => {
    const muted = webRTCService.toggleMute();
    setMuted(muted);
  }, [setMuted]);

  return {
    status,
    localStream,
    remoteStream,
    isMuted,
    participant,
    callId,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    cancelCallRequest,
    autoCallReject,
  };
};
