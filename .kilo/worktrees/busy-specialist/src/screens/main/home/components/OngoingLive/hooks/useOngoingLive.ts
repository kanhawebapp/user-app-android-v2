import { useCallback } from 'react';
import { LiveSession } from '../type';

// Default ongoing live sessions (dummy data for when API doesn't return data)
export const DEFAULT_ONGOING_LIVES: LiveSession[] = [
  {
    id: '1',
    title: 'Kundli Reading Session',
    astrologerName: 'Astrologer Rahul',
    viewerCount: 156,
    status: 'live',
  },
  {
    id: '2',
    title: 'Vastu Consultation',
    astrologerName: 'Astrologer Priya',
    viewerCount: 89,
    status: 'live',
  },
  {
    id: '3',
    title: 'Gemstone Guidance',
    astrologerName: 'Astrologer Amit',
    viewerCount: 234,
    status: 'live',
  },
];

export const useOngoingLive = (
  sessions: LiveSession[] = [],
  onSessionPress?: (session: LiveSession) => void,
  onViewAllPress?: () => void
) => {
  // Use default data when sessions array is empty (simulating API data)
  const sessionsData = sessions.length > 0 ? sessions : DEFAULT_ONGOING_LIVES;

  // Handle session card press
  const handleSessionPress = useCallback(
    (session: LiveSession) => {
      onSessionPress?.(session);
    },
    [onSessionPress]
  );

  // Handle view all press
  const handleViewAllPress = useCallback(() => {
    onViewAllPress?.();
  }, [onViewAllPress]);

  // Check if session is live
  const isLiveSession = useCallback((session: LiveSession) => {
    return session.status === 'live';
  }, []);

  return {
    sessions: sessionsData,
    handleSessionPress,
    handleViewAllPress,
    isLiveSession,
  };
};

