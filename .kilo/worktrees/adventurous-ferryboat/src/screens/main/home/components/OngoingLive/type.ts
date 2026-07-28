import {ViewStyle} from 'react-native';

// ==================== Live Session Types ====================
export interface LiveSession {
  id: string;
  title: string;
  astrologerName: string;
  astrologerImage?: any;
  viewerCount?: number;
  status: 'live' | 'upcoming' | 'ended';
  thumbnail?: any;
  scheduledTime?: string;
  duration?: string;
}

export interface OngoingLiveProps {
  sessions?: LiveSession[];
  onSessionPress?: (session: LiveSession) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}
