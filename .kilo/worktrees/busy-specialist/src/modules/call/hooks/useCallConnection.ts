import {useState, useEffect, useRef, useCallback} from 'react';
import {useCallStore} from '../../../stores/call.store';
import webrtcService from '../services/webrtc.service';
import signalingService from '../services/signaling.service';
import { MediaStream } from 'react-native-webrtc';
import { RTCSessionDescriptionInit } from 'react-native-webrtc/lib/typescript/RTCSessionDescription';

interface UseCallConnectionOptions {
  roomId: string;
  userId: string;
  targetId: string;
  callType: 'voice' | 'video';
  signalingUrl?: string;
  onCallConnected?: () => void;
  onCallEnded?: () => void;
  onError?: (error: Error) => void;
}

export const useCallConnection = (options: UseCallConnectionOptions) => {
  const {
    roomId,
    userId,
    targetId,
    callType,
    signalingUrl = 'wss://your-signaling-server.com',
    onCallConnected,
    onCallEnded,
    onError,
  } = options;

  const {
    callStatus,
    isMuted,
    isSpeakerOn,
    isVideoEnabled,
    isConnecting,
    isConnected,
    callDuration,
    setCallStatus,
    setMuted,
    toggleMute: storeToggleMute,
    setSpeakerOn,
    toggleSpeaker: storeToggleSpeaker,
    setVideoEnabled,
    toggleVideo: storeToggleVideo,
    setConnecting,
    setConnected,
    incrementDuration,
    endCall: storeEndCall,
    resetCall,
  } = useCallStore();

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<string>('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      incrementDuration();
    }, 1000);
  }, [incrementDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      setConnecting(true);
      setCallStatus('connecting');

      await signalingService.connect(signalingUrl, userId, roomId);

      webrtcService.handleRemoteStream(stream => {
        setRemoteStream(stream);
      });

      webrtcService.handleConnectionStateChange(state => {
        setConnectionState(state);
        if (state === 'connected' || state === 'completed') {
          setConnected(true);
          setConnecting(false);
          setCallStatus('active');
          startTimer();
          onCallConnected?.();
        } else if (state === 'disconnected' || state === 'failed') {
          handleReconnect();
        }
      });

      const stream = await webrtcService.getLocalStream(
        callType === 'video'
          ? {audio: true, video: true}
          : {audio: true, video: false},
      );
      setLocalStream(stream);

      webrtcService.createPeerConnection();

      signalingService.on('offer', async message => {
        const answer = await webrtcService.handleOffer(
          message.payload as RTCSessionDescriptionInit,
        );
        if (answer) {
          signalingService.sendAnswer(
            answer as RTCSessionDescriptionInit,
            roomId,
            message.senderId,
          );
        }
      });

      signalingService.on('answer', async message => {
        await webrtcService.handleAnswer(
          message.payload as RTCSessionDescriptionInit,
        );
      });

      signalingService.on('ice-candidate', async message => {
        await webrtcService.addICECandidate(
          message.payload as any,
        );
      });

      signalingService.on('call-end', () => {
        handleCallEnd();
      });

      const offer = await webrtcService.createOffer();
      if (offer) {
        signalingService.sendOffer(
          offer as RTCSessionDescriptionInit,
          roomId,
          targetId,
        );
      }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Connection failed');
      setConnecting(false);
      setCallStatus('failed');
      onError?.(err);
    }
  }, [
    signalingUrl,
    userId,
    roomId,
    targetId,
    callType,
    setConnecting,
    setCallStatus,
    setConnected,
    startTimer,
    onCallConnected,
    onError,
  ]);

  const handleReconnect = useCallback(async () => {
    console.log('Attempting to reconnect...');
    try {
      await webrtcService.reconnect();
      const offer = await webrtcService.createOffer();
      if (offer) {
        signalingService.sendOffer(
          offer as RTCSessionDescriptionInit,
          roomId,
          targetId,
        );
      }
    } catch (err) {
      console.error('Reconnection failed:', err);
    }
  }, [roomId, targetId]);

  const handleCallEnd = useCallback(() => {
    stopTimer();
    webrtcService.cleanup();
    setLocalStream(null);
    setRemoteStream(null);
    setConnected(false);
    setConnecting(false);
    setConnectionState('');
    storeEndCall();
    signalingService.disconnect();
    onCallEnded?.();
  }, [stopTimer, setConnected, setConnecting, storeEndCall, onCallEnded]);

  const handleMute = useCallback(
    (muted: boolean) => {
      webrtcService.toggleMute(muted);
      setMuted(muted);
    },
    [setMuted],
  );

  const handleVideo = useCallback(
    (enabled: boolean) => {
      webrtcService.toggleVideo(enabled);
      setVideoEnabled(enabled);
    },
    [setVideoEnabled],
  );

  const handleSpeaker = useCallback(
    (speakerOn: boolean) => {
      webrtcService.toggleSpeaker(speakerOn);
      setSpeakerOn(speakerOn);
    },
    [setSpeakerOn],
  );

  const switchCamera = useCallback(async () => {
    await webrtcService.switchCamera();
  }, []);

  useEffect(() => {
    return () => {
      stopTimer();
      webrtcService.cleanup();
      signalingService.disconnect();
    };
  }, [stopTimer]);

  return {
    localStream,
    remoteStream,
    callStatus,
    isMuted,
    isSpeakerOn,
    isVideoEnabled,
    isConnecting,
    isConnected,
    callDuration,
    connectionState,
    connect,
    endCall: handleCallEnd,
    handleMute,
    handleVideo,
    handleSpeaker,
    switchCamera,
    resetCall,
  };
};

export default useCallConnection;
