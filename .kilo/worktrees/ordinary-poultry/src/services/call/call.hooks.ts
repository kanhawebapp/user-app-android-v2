import {useEffect, useCallback, useRef} from 'react';
import {useCallStore} from './call.store';
import {webRTCService} from './webrtc.service';
import {signalingService} from './signaling.service';
import {CallRequestData} from './call.types';
import {setupWebRTCListeners} from './webrtc.service';
import {socketService} from '../socket/socket.service';

export const useCall = () => {
  const {
    status,
    localStream,
    remoteStream,
    isMuted,
    participant,
    callId,
    setParticipant,
    setMuted,
    setStatus,
    setRoomId,
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

    signalingService.registerCallbacks({
      onIncomingCall: handleIncomingCall,
      onCallAccepted: handleCallAccepted,
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

  const handleIncomingCall = useCallback(
    (data: CallRequestData) => {
      console.log('[Call Hook] Incoming call received:', data);
      setParticipant({
        id: data.callerId,
        name: data.callerName,
        image: data.callerImage,
      });
      useCallStore.setState({callId: data.callId, roomId: data.roomId});
      webRTCService.setCallInfo({
        callId: data.callId,
        callerId: data.callerId,
        calleeId: data.calleeId,
        roomId: data.roomId,
      });
      setStatus('ringing');
    },
    [setParticipant, setStatus],
  );

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

  const startCall = useCallback(
    async (data: CallRequestData) => {
      try {
        peerJoinedReceived.current = false;

        console.log('[Call Hook] Starting call as caller');
        console.log('[Call Hook] Call data:', {
          callId: data.callId,
          roomId: data.roomId,
          callerId: data.callerId,
          calleeId: data.calleeId,
        });

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
          status: 'calling',
        });

        // Make sure socket is connected
        const socket = socketService.getSocket();
        if (!socket || !socket.connected) {
          console.error('[Call Hook] Socket not connected, waiting...');
          await socketService.connectAndWait();
        }

        // Listen for peer_joined on the socket - this is the trigger to create offer
        // The socket listener is already set up via setupWebRTCListeners()
        // which calls webRTCService.handlePeerJoined() when peer_joined arrives

        // Step 1: Emit join_call to server (server will notify astrologer)
        console.log('[Call Hook] Emitting join_call');
        socketService.emit('join_call', {
          room_id: data.roomId,
          user_id: data.callerId,
        });

      } catch (error: any) {
        console.error('[Call Hook] Start call error:', error);
        webRTCService.emitState('ended', {
          error: error.message || 'Failed to start call',
        });
      }
    },
    [],
  );

  const acceptCall = useCallback(
    async (data: CallRequestData) => {
      try {
        await webRTCService.acceptCall(data);
      } catch (error: any) {
        console.error('[Call] Accept call error:', error);
        webRTCService.emitState('ended', {
          error: error.message || 'Failed to accept call',
        });
      }
    },
    [],
  );

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
