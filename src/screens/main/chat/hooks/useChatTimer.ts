import {useEffect} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useChatStore} from '../../../../services/chat/chat.store';

interface UseChatTimerProps {
  chatStatus: string;
  chatDuration: number;
}

export const useChatTimer = ({chatStatus, chatDuration}: UseChatTimerProps) => {
  const timeLeft = useChatStore(state => state.timeLeft);
  const setTimeLeft = useChatStore(state => state.setTimeLeft);
  const setIsChatTimerStarted = useChatStore(
    state => state.setIsChatTimerStarted,
  );
  const startChatTimer = useChatStore(state => state.startChatTimer);
  const stopChatTimer = useChatStore(state => state.stopChatTimer);
  const syncChatTimerFromWallClock = useChatStore(
    state => state.syncChatTimerFromWallClock,
  );

  // Start timer when chat becomes active, stop on cleanup
  useEffect(() => {
    if (chatStatus === 'active') {
      setTimeLeft(chatDuration);
      setIsChatTimerStarted(true);
      startChatTimer();
    }

    return () => {
      stopChatTimer();
    };
  }, [
    chatStatus,
    chatDuration,
    setTimeLeft,
    setIsChatTimerStarted,
    startChatTimer,
    stopChatTimer,
  ]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        syncChatTimerFromWallClock();
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [syncChatTimerFromWallClock]);

  return {timeLeft, chatDuration, chatStatus};
};
