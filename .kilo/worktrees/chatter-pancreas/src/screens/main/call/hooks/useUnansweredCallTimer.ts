import {useEffect, useRef, useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {socketService} from '../../../../services/socket/socket.service';
import {useCallStore} from '../../../../services/call/call.store';
import {webRTCService} from '../../../../services/call/webrtc.service';

export const useUnansweredCallTimer = (
  isIncoming: boolean,
  status: string,
  participantId: string,
  callId: string,
  unansweredCallTimerRef: React.MutableRefObject<NodeJS.Timeout | null>,
) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (!isIncoming && status === 'calling') {
      console.log('[CallScreen] Starting unanswered call timer (60s)');

      unansweredCallTimerRef.current = setTimeout(() => {
        console.log('[CallScreen] Call not answered within 60s, ending call');

        socketService.emit('autodisconnect', {
          room_id: useCallStore.getState().roomId,
          astroid: participantId,
          type: 'call',
        });

        webRTCService.cleanup();
        useCallStore.getState().reset();

        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }, 60_000);
    }

    // Clear the timer once the call is connected
    if (status === 'connected') {
      console.log('[CallScreen] Call connected, clearing unanswered timer');

      if (unansweredCallTimerRef.current) {
        clearTimeout(unansweredCallTimerRef.current);
        unansweredCallTimerRef.current = null;
      }
    }

    // Cleanup on unmount / status change
    return () => {
      if (unansweredCallTimerRef.current) {
        clearTimeout(unansweredCallTimerRef.current);
        unansweredCallTimerRef.current = null;
      }
    };
  }, [
    isIncoming,
    status,
    participantId,
    callId,
    navigation,
    unansweredCallTimerRef,
  ]);
};
