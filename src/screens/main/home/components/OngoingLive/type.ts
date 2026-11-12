import {ViewStyle} from 'react-native';
import type {UpcomingLive} from '../../../../../services/api/liveSessions/live-sessions.types';

export type {UpcomingLive};

export interface OngoingLiveProps {
  sessions?: UpcomingLive[];
  loading?: boolean;
  joiningSessionId?: string | null;
  onSessionPress?: (session: UpcomingLive) => void;
  onJoinPress?: (session: UpcomingLive) => void;
  onViewAllPress?: () => void;
  style?: ViewStyle;
}
