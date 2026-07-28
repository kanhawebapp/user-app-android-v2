import {useState, useEffect, useCallback} from 'react';
import {webRTCService} from '../../../services/call/webrtc.service';
import {MediaStream} from 'react-native-webrtc';

interface UseWebRTCOptions {
  roomId: string;
  userId: string;
  isInitiator: boolean;
  onRemoteStream?: (stream: MediaStream | null) => void;
  onCallConnected?: () => void;
  onCallEnded?: () => void;
  onError?: (error: Error) => void;
}

export const useWebRTC = (options: UseWebRTCOptions) => {
  const {onRemoteStream, onCallConnected, onCallEnded, onError} = options;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    webRTCService.handleRemoteStream((stream: MediaStream | null) => {
      setRemoteStream(stream);
      onRemoteStream?.(stream);
    });

    webRTCService.handleConnectionStateChange((state: string) => {
      setConnectionState(state);
      if (state === 'connected' || state === 'completed') {
        setIsConnected(true);
        setIsConnecting(false);
        onCallConnected?.();
      } else if (state === 'failed') {
        setIsConnected(false);
        setIsConnecting(false);
      }
    });

    return () => {
      webRTCService.cleanup();
    };
  }, [onRemoteStream, onCallConnected]);

  const initializeMedia = useCallback(async () => {
    const stream = await webRTCService.getLocalStream();
    setLocalStream(stream);
    return stream;
  }, []);

  const endCall = useCallback(() => {
    console.log('[WebRTC] Ending call and cleaning up i am hereeeee');
    webRTCService.cleanup();
    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionState('');
    // onCallEnded?.();
  }, [onCallEnded]);

  const toggleMute = useCallback(() => {
    webRTCService.toggleMute();
  }, []);

  const toggleSpeaker = useCallback((speakerOn: boolean) => {
    webRTCService.toggleSpeaker(speakerOn);
  }, []);

  const startCall = useCallback(async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await initializeMedia();
    } catch (err) {
      const errObj =
        err instanceof Error ? err : new Error('Failed to start call');
      setError(errObj);
      setIsConnecting(false);
      onError?.(errObj);
    }
  }, [initializeMedia, onError]);

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
    toggleSpeaker,
  };
};

export default useWebRTC;
