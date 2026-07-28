import { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { webRTCService } from '../../../../modules/call';
import { useCallStore } from '../../../../services/call/call.store';
import { socketService } from '../../../../services/socket/socket.service';

export const useUnifiedCallCleanup = () => {
  const callEndedInProgressRef = useRef(false);

  const performCallCleanup = useCallback(() => {
    callEndedInProgressRef.current = true;

    // Stop ringback / hang up
    webRTCService.cleanup();

    // Fully reset the call store
    useCallStore.getState().reset();
  }, []);

  return { performCallCleanup, callEndedInProgressRef };
};

/**
 * useCallActions
 *
 * Groups every user-triggered call action into a single cohesive hook.
 */
export const useCallActions = () => {
  const navigation = useNavigation();

  const { performCallCleanup } = useUnifiedCallCleanup();

  const endCall = useCallback(
    ({ roomId, astroId }: { roomId: any | null; astroId: any | null }) => {
      try {
        performCallCleanup();
        const socket = socketService.getSocket();
        socket?.emit('call_ended_by_user', {
          room_id: roomId,
          astro_id: astroId,
        });
      } catch (error) {
        console.error('[CALL END ERROR]', error);
      }
    },
    [performCallCleanup],
  );

  const toggleMute = useCallback(() => {
    const muted = webRTCService.toggleMute();
    useCallStore.getState().setMuted(muted);
    return muted;
  }, []);

  const toggleSpeaker = useCallback((speakerOn: boolean): boolean => {
    webRTCService.toggleSpeaker(speakerOn);
    useCallStore.getState().setSpeakerOn(speakerOn);
    return speakerOn;
  }, []);

  const confirmEndCall = useCallback((endFn: () => void) => {
    Alert.alert('End Call', 'Are you sure you want to end this call?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'End',
        style: 'destructive',
        onPress: endFn,
      },
    ]);
  }, []);

  return {
    endCall,
    toggleMute,
    toggleSpeaker,
    confirmEndCall,
    performCallCleanup,
  };
};
