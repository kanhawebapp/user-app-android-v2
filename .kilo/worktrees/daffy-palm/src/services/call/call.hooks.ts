import {useCallback, useEffect, useRef} from 'react';

import {useCallStore} from './call.store';
import {webRTCService, setupWebRTCListeners} from './webrtc.service';
import {signalingService} from './signaling.service';
import {CallRequestData} from './call.types';
import {socketService} from '../socket/socket.service';
import InCallManager from 'react-native-incall-manager';

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
  } = useCallStore();

  const durationInterval = useRef<NodeJS.Timeout | null>(null);
  const peerJoinedReceived = useRef(false);

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
       // ADDED FOR RINGBACK
       if (state.status === 'connected') {
         InCallManager.stopRingback();
         console.log('[Ringback] stopped');
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
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  const handleCallAccepted = useCallback(() => {
    setStatus('connected');
  }, [setStatus]);

   const handleCallRejected = useCallback(
    (data: {callId: string; reason?: string}) => {
      webRTCService.cleanup();
      webRTCService.emitState('rejected', {
        error: data.reason || 'Call rejected',
      });
      // ADDED FOR RINGBACK
      InCallManager.stopRingback();
      console.log('[Ringback] stopped');
    },
    [],
  );

  // useEffect(() => {
  //   const socket = socketService.getSocket();
  //   if (!socket) return;

  //   const onAstrologerEnd = (data: {room_id: string}) => {
  //     console.log('[CALL END] Astrologer ended call');

  //     // cleanup + UI update
  //     webRTCService.cleanup();
  //     useCallStore.setState({status: 'ended'});
  //   };

  //   socket.on('call_ended_by_astrologer', onAstrologerEnd);

  //   return () => {
  //     socket.off('call_ended_by_astrologer', onAstrologerEnd);
  //   };
  // }, []);

  // const handleCallEnded = useCallback(() => {
  //   webRTCService.cleanup();
  //   webRTCService.emitState('ended');
  // }, []);

  // const handleCallEnded = useCallback(() => {
  //   console.log('[CALL] Remote ended the call');

  //   webRTCService.cleanup();

  //   useCallStore.setState({
  //     status: 'ended',
  //     localStream: null,
  //     remoteStream: null,
  //   });

  //   webRTCService.emitState('ended');
  // }, []);

   const handleCallEnded = useCallback(() => {
     console.log('[CALL] Call ended (remote or astrologer)');

     // ADDED FOR RINGBACK
     InCallManager.stopRingback();
     console.log('[Ringback] stopped');

     webRTCService.cleanup();

     useCallStore.setState({
       status: 'ended',
       localStream: null,
       remoteStream: null,
     });

     // optional safety
     webRTCService.emitState('ended');
   }, []);

  const startCall = useCallback(async (data: CallRequestData) => {
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

      // const onAccepted = async (eventData: any) => {
      //   console.log('[USER CALL] callAcceptedByAstrologer received', eventData);

      //   const normalizedRoomId = eventData?.room_id || eventData?.roomId;

      //   console.log('[SIGNAL NORMALIZED ROOM]', {
      //     event: 'callAcceptedByAstrologer',
      //     room_id: eventData?.room_id,
      //     roomId: eventData?.roomId,
      //     normalizedRoomId,
      //   });

      //   if (!normalizedRoomId) {
      //     console.log('[USER CALL] Missing room_id');
      //     return;
      //   }

      //   if (!socket) {
      //     throw new Error('Socket is null in onAccepted handler');
      //   }

      //   // IMPORTANT:
      //   // CHANGE UI STATE IMMEDIATELY
      //   useCallStore.setState({
      //     status: 'connecting',
      //   });

      //   console.log('[USER CALL] Status changed to connecting');

      //   // JOIN ROOM ONLY AFTER ACCEPT
      //   // socket.emit('join_call', {
      //   //   room_id,
      //   // });

      //   // console.log('[SOCKET EMIT] join_call emitted', room_id);

      //   socket.emit('join_call', {
      //     room_id: normalizedRoomId,
      //   });

      //   console.log('[SOCKET EMIT] join_call emitted', normalizedRoomId);
      // };

       const onAccepted = async (eventData: any) => {
         console.log('[USER CALL] callAcceptedByAstrologer received', eventData);

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

         useCallStore.setState({
           status: 'connecting',
         });
         // ADDED FOR RINGBACK
         InCallManager.stopRingback();
         console.log('[Ringback] stopped');
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
      webRTCService.emitState('ended', {
        error: error.message || 'Failed to start call',
      });
    }
  }, []);

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
    // Current WebRTC service exposes cleanup() only.
    webRTCService.cleanup();
    useCallStore.setState({status: 'ended'});
  }, []);

  // const endCall = useCallback(async () => {
  //   // End = cleanup.

  //   webRTCService.cleanup();
  //   useCallStore.setState({status: 'ended'});
  // }, []);

  useEffect(() => {
    const socket = socketService.getSocket();

    const handleCallEndedByAstrologer = () => {
      console.log('[CALL END] Astrologer ended call:');

      webRTCService.cleanup();

      useCallStore.setState({
        status: 'ended',
        localStream: null,
        remoteStream: null,
      });
    };

    socket?.on('call_ended_by_astrologer', handleCallEndedByAstrologer);

    return () => {
      socket?.off('call_ended_by_astrologer', handleCallEndedByAstrologer);
    };
  }, []);

  const endCall = useCallback(async () => {
    try {
      const socket = socketService.getSocket();
      console.log('i am here to caa');
      const roomId =
        useCallStore.getState().roomId || webRTCService.getRoomId();

      console.log('[CALL END] emitting call_ended_by_user:', roomId);

      // SAME AS WEB
      socket?.emit('call_ended_by_user', {
        room_id: roomId,
      });

      webRTCService.cleanup();

      useCallStore.setState({
        status: 'ended',
      });
    } catch (error) {
      console.error('[CALL END ERROR]', error);
    }
  }, []);

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
  };
};
