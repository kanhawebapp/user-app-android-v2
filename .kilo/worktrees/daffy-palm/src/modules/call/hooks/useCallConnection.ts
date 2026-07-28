import {useState, useEffect, useCallback} from 'react';
import {
  webRTCService,
  setupWebRTCListeners,
} from '../../../services/call/webrtc.service';
import {MediaStream} from 'react-native-webrtc';
import {socketService} from '../../../services/socket/socket.service';

interface UseCallConnectionOptions {
  room_id: string;
  userId: string;
  targetId: string;

  signalingUrl?: string;
  onCallConnected?: () => void;
  onCallEnded?: () => void;
  onError?: (error: Error) => void;
}

export const useCallConnection = (options: UseCallConnectionOptions) => {
  const {room_id, userId, targetId, onCallConnected, onCallEnded, onError} =
    options;

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<string>('');

  useEffect(() => {
    setupWebRTCListeners();

    webRTCService.handleRemoteStream((stream: MediaStream | null) => {
      setRemoteStream(stream);
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
  }, [onCallConnected]);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);

      webRTCService.setCallInfo({
        callId: room_id,
        callerId: userId,
        calleeId: targetId,
        room_id,
      });

      const stream = await webRTCService.getLocalStream();
      setLocalStream(stream);

      webRTCService.createPeerConnection();
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Connection failed');
      setIsConnecting(false);
      onError?.(err);
    }
  }, [room_id, userId, targetId, onError]);

  // const endCall = useCallback(() => {
  //   webRTCService.cleanup();
  //   setLocalStream(null);
  //   setRemoteStream(null);
  //   setIsConnected(false);
  //   setIsConnecting(false);
  //   setConnectionState('');
  //   onCallEnded?.();
  // }, [onCallEnded]);
  const endCall = useCallback(() => {
    const socket = socketService.getSocket();
   console.log("i am herre too")
    // SAME PAYLOAD AS WEB
    socket?.emit('call_ended_by_user', {
      room_id,
    });

    console.log('[CALL] call_ended_by_user emitted:', room_id);

    webRTCService.cleanup();

    setLocalStream(null);
    setRemoteStream(null);
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionState('');

    onCallEnded?.();
  }, [room_id, onCallEnded]);

  const toggleMute = useCallback(() => {
    webRTCService.toggleMute();
  }, []);

  const toggleSpeaker = useCallback((speakerOn: boolean) => {
    webRTCService.toggleSpeaker(speakerOn);
  }, []);

  return {
    localStream,
    remoteStream,
    isConnecting,
    isConnected,
    connectionState,
    connect,
    endCall,
    toggleMute,
    toggleSpeaker,
  };
};

export default useCallConnection;
