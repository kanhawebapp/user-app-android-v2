import {useEffect, useRef, useCallback} from 'react';
import {useCallStore} from '../../../../services/call/call.store';
import {socketService} from '../../../../services/socket/socket.service';

export const useCallTimer = () => {
  const countdownTimerInterval = useRef<NodeJS.Timeout | null>(null);
  const callEndedInProgressRef = useRef(false);

  const setCallDurationRemaining = useCallStore(
    state => state.setCallDurationRemaining,
  );
  const resetCallTimer = useCallStore(state => state.resetCallTimer);
  const status = useCallStore(state => state.status);

  useEffect(() => {
    if (status !== 'connected') {
      return;
    }

    countdownTimerInterval.current = setInterval(() => {
      const remaining = useCallStore.getState().callDurationRemaining;
      const socket = socketService.getSocket();

      console.log('[Timer] TICK - remaining:', remaining);

      if (remaining <= 0) {
        // Guard: only trigger endCall once
        if (!callEndedInProgressRef.current) {
          callEndedInProgressRef.current = true;
          console.log('[Timer] Countdown reached 0 — ending call');
          socket?.emit('call_ended_by_user', {
            room_id: useCallStore.getState().roomId,
            astro_id: useCallStore.getState().participant?.id,
          });
        }
        return;
      }

      setCallDurationRemaining(remaining - 1);
    }, 1_000);

    return () => {
      if (countdownTimerInterval.current) {
        clearInterval(countdownTimerInterval.current);
        countdownTimerInterval.current = null;
      }
    };
  }, [status, setCallDurationRemaining]);

  // Reset the one-shot end-call guard when a brand-new call arrives
  const resetEndCallGuard = useCallback(() => {
    if (status === 'initiated') {
      callEndedInProgressRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    resetEndCallGuard();
  }, [resetEndCallGuard]);

  return {resetCallTimer};
};
