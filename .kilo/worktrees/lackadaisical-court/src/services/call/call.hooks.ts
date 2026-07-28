import {useEffect, useCallback, useRef} from 'react';
import {useCallStore} from './call.store';
import {webRTCService, setupWebRTCListeners} from './webrtc.service';
import {signalingService} from './signaling.service';
import {CallRequestData} from './call.types';
import {socketService} from '../socket/socket.service';

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
    },
    [],
  );

  const handleCallEnded = useCallback(() => {
    webRTCService.cleanup();
    webRTCService.emitState('ended');
  }, []);

   const startCall = useCallback(async (data: CallRequestData) => {
     try {
       peerJoinedReceived.current = false;

       console.log('[Call Hook] Starting call as caller');
       console.log('[Call Hook] Call data:', {
         callId: data.callId,
         roomId: data.roomId,
         callerId: data.callerId,
         calleeId: data.calleeId,
       });

       // Set initial UI state to 'calling'
       useCallStore.setState({
        status: 'calling',
       });

       // Validation
       if (!data.roomId) {
         console.error('[USER CALL] roomId missing before join_call emit');
         return;
       }

       // Store call info in the service FIRST
       webRTCService.setCallInfo({
         callId: data.callId,
         callerId: data.callerId,
         calleeId: data.calleeId,
         roomId: data.roomId,
       });
       console.log(
         '[WebRTC] Current roomId after setCallInfo:',
         webRTCService.getRoomId(),
       );

       // Store call info in the store
       useCallStore.setState({
         callId: data.callId,
         callerId: data.callerId,
         calleeId: data.calleeId,
         roomId: data.roomId,
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
         console.log('[USER CALL] Socket connected:', socket.id);
       }

       // Listen for callAcceptedByAstrologer - join_call ONLY after astrologer accepts
       (socket as any).off('callAcceptedByAstrologer');

       const onAccepted = async (eventData: any) => {
         console.log('[USER CALL] callAcceptedByAstrologer received', eventData);

         const roomId = eventData?.roomId || data.roomId;

         if (!roomId) {
           console.log('[USER CALL] Missing roomId');
           return;
         }

         // IMPORTANT:
         // CHANGE UI STATE IMMEDIATELY
         useCallStore.setState({
           status: 'connecting',
         });

         console.log(
           '[USER CALL] Status changed to connecting',
         );

         // JOIN ROOM ONLY AFTER ACCEPT
         socket.emit('join_call', {
           roomId,
         });

         console.log(
           '[SOCKET EMIT] join_call emitted',
           roomId,
         );
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
    webRTCService.rejectCall();
  }, []);

  const endCall = useCallback(async () => {
    await webRTCService.endCall();
  }, []);

  const toggleMute = useCallback(() => {
    const muted = webRTCService.toggleMute();
    setMuted(muted);
  }, [setMuted]);

  const switchCamera = useCallback(async () => {
    return await webRTCService.switchCamera();
  }, []);

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
    switchCamera,
  };
};
