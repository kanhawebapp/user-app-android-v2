import {useState, useEffect, useCallback, useRef} from 'react';
import {Alert} from 'react-native';
import webrtcService from '../services/webrtc.service';
import signalingService from '../services/signaling.service';
import {DEFAULT_MEDIA_CONSTRAINTS, MediaConstraints} from '../types/call.types';
import {MediaStream} from 'react-native-webrtc';
import {RTCSessionDescriptionInit} from 'react-native-webrtc/lib/typescript/RTCSessionDescription';

interface UseWebRTCOptions {
  roomId: string;
  userId: string;
  isInitiator: boolean;
  callType: 'voice' | 'video';
  onRemoteStream?: (stream: MediaStream | null) => void;
  onCallConnected?: () => void;
  onCallEnded?: () => void;
  onError?: (error: Error) => void;
}

export const useWebRTC = (options: UseWebRTCOptions) => {
  const {
    roomId,
    userId,
    isInitiator,
    callType,
    onRemoteStream,
    onCallConnected,
    onCallEnded,
    onError,
  } = options;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  const isInitiatorRef = useRef(isInitiator);
  const roomIdRef = useRef(roomId);
  const userIdRef = useRef(userId);

  useEffect(() => {
    isInitiatorRef.current = isInitiator;
    roomIdRef.current = roomId;
    userIdRef.current = userId;
  }, [isInitiator, roomId, userId]);

  const initializeMedia = useCallback(async () => {
    const constraints: MediaConstraints =
      callType === 'video'
        ? DEFAULT_MEDIA_CONSTRAINTS
        : {audio: true, video: false};

    const stream = await webrtcService.getLocalStream(constraints);
    setLocalStream(stream);
    return stream;
  }, [callType]);

  const initializePeerConnection = useCallback(() => {
    webrtcService.createPeerConnection();

    webrtcService.handleRemoteStream(stream => {
      setRemoteStream(stream);
      onRemoteStream?.(stream);
    });

    webrtcService.handleICECandidate(candidate => {
      if (candidate) {
        signalingService.sendICECandidate(
          candidate.toJSON() as any,
          roomIdRef.current,
        );
      }
    });

    webrtcService.handleConnectionStateChange(state => {
      setConnectionState(state);
      if (state === 'connected' || state === 'completed') {
        setIsConnected(true);
        setIsConnecting(false);
        onCallConnected?.();
      } else if (state === 'disconnected' || state === 'failed') {
        handleReconnect();
      }
    });
  }, [onRemoteStream, onCallConnected]);

  const setupSignalingHandlers = useCallback(() => {
    signalingService.on('offer', async message => {
      console.log('Received offer');
      const answer = await webrtcService.handleOffer(
        message.payload as RTCSessionDescriptionInit,
      );
      if (answer) {
        signalingService.sendAnswer(
          answer as RTCSessionDescriptionInit,
          roomIdRef.current,
          message.senderId,
        );
      }
    });

    signalingService.on('answer', async message => {
      console.log('Received answer');
      await webrtcService.handleAnswer(
        message.payload as RTCSessionDescriptionInit,
      );
    });

    signalingService.on('ice-candidate', async message => {
      console.log('Received ICE candidate');
      await webrtcService.addICECandidate(message.payload as any);
    });

    signalingService.on('call-end', () => {
      console.log('Call ended by remote');
      endCall();
      onCallEnded?.();
    });

    signalingService.on('peer-disconnected', () => {
      console.log('Peer disconnected, attempting reconnect');
      handleReconnect();
    });

    signalingService.on('peer-reconnected', () => {
      console.log('Peer reconnected');
    });
  }, [onCallEnded]);

  const startCall = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);

      await initializeMedia();
      initializePeerConnection();
      setupSignalingHandlers();

      if (isInitiatorRef.current) {
        const offer = await webrtcService.createOffer();
        if (offer) {
          signalingService.sendOffer(
            offer as RTCSessionDescriptionInit,
            roomIdRef.current,
          );
        }
      }
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error('Failed to start call');
      setError(error);
      setIsConnecting(false);
      onError?.(error);
      Alert.alert('Call Error', error.message);
    }
  }, [
    initializeMedia,
    initializePeerConnection,
    setupSignalingHandlers,
    onError,
  ]);

  const handleReconnect = useCallback(async () => {
    console.log('Attempting to reconnect...');
    try {
      await webrtcService.reconnect();
      if (isInitiatorRef.current) {
        const offer = await webrtcService.createOffer();
        if (offer) {
          signalingService.sendOffer(
            offer as RTCSessionDescriptionInit,
            roomIdRef.current,
          );
        }
      }
    } catch (err) {
      console.log('Reconnection failed:', err);
    }
  }, []);

  const endCall = useCallback(() => {
    signalingService.sendCallEnd(roomIdRef.current);
    webrtcService.cleanup();
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionState('');
  }, []);

  const toggleMute = useCallback((muted: boolean) => {
    webrtcService.toggleMute(muted);
  }, []);

  const toggleVideo = useCallback((enabled: boolean) => {
    webrtcService.toggleVideo(enabled);
  }, []);

  const toggleSpeaker = useCallback((speakerOn: boolean) => {
    webrtcService.toggleSpeaker(speakerOn);
  }, []);

  const switchCamera = useCallback(async () => {
    await webrtcService.switchCamera();
  }, []);

  useEffect(() => {
    return () => {
      webrtcService.cleanup();
    };
  }, []);

  return {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    connectionState,
    error,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    toggleSpeaker,
    switchCamera,
  };
};

export default useWebRTC;
