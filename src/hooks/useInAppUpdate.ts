import {useCallback, useEffect, useRef, useState} from 'react';
import {
  completeUpdate,
  requestInAppUpdate,
  subscribeToUpdateReady,
} from '../services/inAppUpdateService';

interface UseInAppUpdateOptions {
  enabled: boolean;
}

export const useInAppUpdate = ({enabled}: UseInAppUpdateOptions) => {
  const [isUpdateReadyVisible, setIsUpdateReadyVisible] = useState(false);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const unsubscribe = subscribeToUpdateReady(() => {
      setIsUpdateReadyVisible(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!enabled || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;

    const timeoutId = setTimeout(() => {
      void requestInAppUpdate();
    }, 750);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [enabled]);

  const handleRestart = useCallback(() => {
    void completeUpdate();
  }, []);

  return {
    isUpdateReadyVisible,
    handleRestart,
  };
};
