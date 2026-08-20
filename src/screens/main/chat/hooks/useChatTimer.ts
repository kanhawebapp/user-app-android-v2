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
  const setHasSeededChatCountdown = useChatStore(
    state => state.setHasSeededChatCountdown,
  );
  const startChatTimer = useChatStore(state => state.startChatTimer);
  const stopChatTimer = useChatStore(state => state.stopChatTimer);
  const syncChatTimerFromWallClock = useChatStore(
    state => state.syncChatTimerFromWallClock,
  );

  // Start timer when chat becomes active, stop on cleanup.
  // Do not re-seed the end timestamp on remount/foreground — that would
  // restart the countdown from the full duration.
  useEffect(() => {
    if (chatStatus === 'active') {
      const {hasSeededChatCountdown} = useChatStore.getState();
      if (!hasSeededChatCountdown) {
        setTimeLeft(chatDuration);
        setHasSeededChatCountdown(true);
        setIsChatTimerStarted(true);
      }
      startChatTimer();
      useChatStore.getState().syncChatTimerFromWallClock();
    }

    return () => {
      stopChatTimer();
    };
  }, [
    chatStatus,
    chatDuration,
    setTimeLeft,
    setHasSeededChatCountdown,
    setIsChatTimerStarted,
    startChatTimer,
    stopChatTimer,
  ]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        syncChatTimerFromWallClock();
        useChatStore.getState().flushPendingChatCompletion();
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
