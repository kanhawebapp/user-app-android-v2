import { useCallback, useRef, useEffect, useState } from 'react';
import { useCallStore } from './call.store';

export const useCallTimer = (onTimeout?: () => void) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const startCountdown = useCallback((seconds: number) => {
    // Prevent duplicate intervals
    if (intervalRef.current) {
      console.log('[CallTimer] already running');
      return;
    }

    // Set initial time in store
    useCallStore.getState().setCallDurationRemaining(seconds);
    console.log('[CallTimer] start');
    setIsRunning(true);

    // Start interval
    intervalRef.current = setInterval(() => {
      const state = useCallStore.getState();
      const remaining = state.callDurationRemaining;

      if (remaining <= 0) {
        console.log('[CallTimer] tick: time up');
        // Call timeout callback if provided
        if (onTimeout) {
          onTimeout();
        }
        stopCountdown();
        return;
      }

      console.log('[CallTimer] tick', remaining);
      useCallStore.getState().setCallDurationRemaining(remaining - 1);
    }, 1000);
  }, [onTimeout]);

  const stopCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log('[CallTimer] stop');
      setIsRunning(false);
    }
    // Ensure timer is reset to 0 when stopped
    useCallStore.getState().setCallDurationRemaining(0);
  }, []);

  const resetCountdown = useCallback(() => {
    stopCountdown();
    useCallStore.getState().setCallDurationRemaining(0);
    console.log('[CallTimer] cleanup');
  }, [stopCountdown]);

  // Auto cleanup on unmount
  useEffect(() => {
    return () => {
      stopCountdown();
    };
  }, [stopCountdown]);

  return {
    startCountdown,
    stopCountdown,
    resetCountdown,
    isRunning
  };
};