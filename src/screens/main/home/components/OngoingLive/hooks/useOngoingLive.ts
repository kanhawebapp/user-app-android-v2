import {useCallback} from 'react';
import type {UpcomingLive} from '../../../../../../services/api/liveSessions/live-sessions.types';

export const useOngoingLive = (
  sessions: UpcomingLive[] = [],
  onSessionPress?: (session: UpcomingLive) => void,
  onViewAllPress?: () => void,
) => {
  const handleSessionPress = useCallback(
    (session: UpcomingLive) => {
      onSessionPress?.(session);
    },
    [onSessionPress],
  );

  const handleViewAllPress = useCallback(() => {
    onViewAllPress?.();
  }, [onViewAllPress]);

  const isLiveSession = useCallback((session: UpcomingLive) => {
    return session.status === 'LIVE';
  }, []);

  return {
    sessions,
    handleSessionPress,
    handleViewAllPress,
    isLiveSession,
  };
};
