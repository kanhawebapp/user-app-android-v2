import {AstrologerDetails} from '../../../services/api/astrologerProfile/astrologer-details.types';

export interface AstrologerProfileScreenProps {
  astrologer: AstrologerDetails;
  onBack: () => void;
  onChatPress?: (astrologer: AstrologerDetails) => void;
}