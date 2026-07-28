import {AstrologerDetails} from '../../../services/api/astrologerProfile/astrologer-details.types';
import {Gift} from '../../../services/api/gift/gift.types';

export interface AstrologerProfileScreenProps {
  astrologer: AstrologerDetails;
  onBack: () => void;
  onNavigateToSendGift?: (params: {
    gifts: Gift[];
    astrologerName?: string;
    astrologerProfilePic?: string;
    onSendGift: (gift: Gift, message: string) => Promise<void>;
    loading?: boolean;
  }) => void;
  // onChatPress?: (astrologer: AstrologerDetails) => void;
}