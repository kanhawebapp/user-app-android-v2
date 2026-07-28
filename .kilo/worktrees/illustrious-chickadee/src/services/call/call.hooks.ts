import {useEffect, useCallback, useRef} from 'react';
import {useCallStore} from './call.store';
import {webRTCService} from './webrtc.service';
import {signalingService} from './signaling.service';
import {CallRequestData} from './call.types';

export const useCall = () => {
  const {
    status,
    localStream,
    remoteStream,
    isMuted,
    participant,
    callId,
    setError,
    setStatus,
    setParticipant,
    setMuted,
    reset,
  } = useCallStore();

  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    webRTCService.setStateCallback(state => {
      useCallStore.setState({
        localStream: state.localStream,
        remoteStream: state.remoteStream,
        isMuted: state.isMuted,
        error: state.error,
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

  const handleIncomingCall = useCallback((data: CallRequestData) => {
    setParticipant({
      id: data.callerId,
      name: data.callerName,
      image: data.callerImage,
    });
    useCallStore.setState({callId: data.callId});
    setStatus('ringing');
  }, [setParticipant, setStatus]);

  const handleCallAccepted = useCallback(() => {
    setStatus('connected');
  }, [setStatus]);

  const handleCallRejected = useCallback((data: {callId: string; reason?: string}) => {
    setError(data.reason || 'Call rejected');
    setStatus('ended');
  }, [setError, setStatus]);

  const handleCallEnded = useCallback(() => {
    setStatus('ended');
  }, [setStatus]);

  const startCall = useCallback(async (data: CallRequestData) => {
    try {
      signalingService.initiateCall(data);
      await webRTCService.startCall(data);
    } catch (error: any) {
      setError(error.message || 'Failed to start call');
      setStatus('ended');
    }
  }, [setError, setStatus]);

  const acceptCall = useCallback(async (data: CallRequestData) => {
    try {
      await webRTCService.acceptCall(data);
    } catch (error: any) {
      setError(error.message || 'Failed to accept call');
      setStatus('ended');
    }
  }, [setError, setStatus]);

  const rejectCall = useCallback(() => {
    webRTCService.rejectCall();
    reset();
  }, [reset]);

  const endCall = useCallback(async () => {
    await webRTCService.endCall();
    reset();
  }, [reset]);

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