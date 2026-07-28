/**
 * ChatCall Screen Types
 * Defines all types used in Chat/Call screen and its components
 */

import {ViewStyle} from 'react-native';
import {ChatRequestData} from '../../../../components/Modal/ChatRequestModal';

// ==================== Navigation Props ====================
export interface ChatCallScreenProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
  onNavigateToAstrologerProfile?: (astrologerId: string) => void;
  onNavigateToChat?: (
    astrologer: Astrologer,
    userData: ChatRequestData,
  ) => void;
  style?: ViewStyle;
}

// ==================== Tab Type ====================
export type TabType = 'chat' | 'call';

// ==================== Astrologer Types ====================
export interface Astrologer {
  id: string;
  name: string;
  image?: any;
  rating: number;
  reviewCount: number;
  experience: string;
  languages: string[];
  skills: string[];
  availability: AstrologerAvailability;
  chatRate: number; // per minute
  callRate: number; // per minute
  isAvailableForChat: boolean;
  isAvailableForCall: boolean;
}

export type AstrologerAvailability = 'online' | 'offline' | 'busy' | 'on_call';

// ==================== Filter Types ====================
export interface FilterOptions {
  availability: AvailabilityFilter;
  priceRange: PriceRange;
  rating: RatingFilter;
  languages: string[];
}

export type AvailabilityFilter = 'all' | 'online' | 'offline';

export interface PriceRange {
  min: number;
  max: number;
}

export type RatingFilter = 'all' | '4+' | '3+';

// ==================== Filter Section Props ====================
export interface FilterSectionProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableLanguages?: string[];
  style?: ViewStyle;
}

// ==================== Astrologer Card Props ====================
export interface AstrologerCardProps {
  astrologer: Astrologer;
  activeTab: TabType;
  onChatPress?: (astrologer: Astrologer) => void;
  onCallPress?: (astrologer: Astrologer) => void;
  onProfilePress?: (astrologer: Astrologer) => void;
  style?: ViewStyle;
}

// ==================== Auth Handler Type ====================
export type AuthActionCallback = () => void;

export interface AuthHandlerProps {
  onNavigateToLogin?: () => void;
  onNavigateToSignup?: () => void;
}
