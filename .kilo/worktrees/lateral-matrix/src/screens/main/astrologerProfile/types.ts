import type {Astrologer} from '../../../services/api/recomandedAstrologer/astrologer.types';

export interface AstrologerProfileScreenProps {
  astrologer: Astrologer;
  onBack: () => void;
  onChatPress?: (astrologer: Astrologer) => void;
}
