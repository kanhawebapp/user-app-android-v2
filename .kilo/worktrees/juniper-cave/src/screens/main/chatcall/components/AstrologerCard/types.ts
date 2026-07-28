/**
 * AstrologerCard Component Types
 */

import {Astrologer, TabType} from '../../types';

export interface AstrologerCardProps {
  astrologer: Astrologer;
  activeTab: TabType;
  onChatPress?: (astrologer: Astrologer) => void;
  onCallPress?: (astrologer: Astrologer) => void;
  onProfilePress?: (astrologer: Astrologer) => void;
  style?: any;
}
