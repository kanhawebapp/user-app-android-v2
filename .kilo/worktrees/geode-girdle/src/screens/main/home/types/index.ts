/**
 * Home Screen Types
 * Defines all types used in home screen components
 */

import {ViewStyle} from 'react-native';

// ==================== Problem Category Types ====================
export interface ProblemCategory {
   id: string;
   title: string;
   icon: string;
   iconLibrary?: string;
   count?: number;
   color?: string;
}

export interface ProblemCategoryProps {
   categories?: ProblemCategory[];
   onCategoryPress?: (category: ProblemCategory) => void;
   style?: ViewStyle;
}

// ==================== Navigation Props ====================

export interface HomeScreenProps {
   onNavigateToTab?: (tab: string) => void;
   onNavigateToLogin?: () => void;
   onNavigateToSignup?: () => void;
   onNavigateToChat?: (astrologerId?: string) => void;
   onNavigateToCall?: (astrologerId?: string) => void;
   onNavigateToLive?: (liveId?: string) => void;
   onNavigateToRemedies?: () => void;
   onNavigateToAstrologerProfile?: (astrologerId: string) => void;
   onNavigateToProduct?: (productId: string) => void;
   onNavigateToTestimonial?: (testimonialId: string) => void;
   onNavigateToShopWebView?: (url: string) => void;
   onNavigateToBlogPost?: (postId: string) => void;
   onNavigateToAstrologerList?: () => void;
   onNavigateToProblemBaseAstroScreen?: (category: ProblemCategory) => void;
}

// ==================== Auth Handler Type ====================
export type AuthActionCallback = () => void;

export interface AuthHandlerProps {
   onNavigateToLogin?: () => void;
   onNavigateToSignup?: () => void;
}

// ==================== Hero Banner Types ====================
export interface HeroBannerData {
   id: string;
   title: string;
   subtitle?: string;
   imageUrl?: any;
   backgroundColor?: string;
   ctaText?: string;
   ctaAction?: string;
}

export interface HeroBannerProps {
   data?: HeroBannerData[];
   onCtaPress?: (action?: string) => void;
   style?: ViewStyle;
}

// ==================== Astrology Guidance Types ====================
export interface GuidanceItem {
   id: string;
   title: string;
   description: string;
   icon: string;
   iconLibrary?: string;
}

export interface AstrologyGuidanceProps {
   items?: GuidanceItem[];
   onItemPress?: (item: GuidanceItem) => void;
   style?: ViewStyle;
}

// ==================== Quick Services Types ====================
export interface QuickService {
   id: string;
   title: string;
   icon: string;
   iconLibrary?: string;
   backgroundColor: string;
   iconColor: string;
}

export interface QuickServicesProps {
   services?: QuickService[];
   onServicePress?: (service: QuickService) => void;
   style?: ViewStyle;
}

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

export interface UpcomingLiveProps {
   sessions?: LiveSession[];
   onSessionPress?: (session: LiveSession) => void;
   onViewAllPress?: () => void;
   style?: ViewStyle;
}

// ==================== Astrologer Types ====================
export interface Astrologer {
   id: string;
   name: string;
   image?: any;
   rating: number;
   experience: string;
   specialties: string[];
   availability: 'online' | 'offline' | 'busy';
   hourlyRate?: number;
}

export interface RecommendedAstrologersProps {
   astrologers?: Astrologer[];
   onAstrologerPress?: (astrologer: Astrologer) => void;
   onViewAllPress?: () => void;
   style?: ViewStyle;
}

// ==================== Featured Remedies Types ====================
export interface Remedy {
   id: string;
   title: string;
   description: string;
   image?: any;
   price?: number;
   duration?: string;
}

export interface FeaturedRemediesProps {
   remedies?: Remedy[];
   onRemedyPress?: (remedy: Remedy) => void;
   onViewAllPress?: () => void;
   style?: ViewStyle;
}

// ==================== Testimonial Types ====================
export interface Testimonial {
   id: string;
   userName: string;
   userImage?: any;
   rating: number;
   comment: string;
   date?: string;
   location?: string;
   image?: any;
}

export interface TestimonialsProps {
   testimonials?: Testimonial[];
   onTestimonialPress?: (testimonial: Testimonial) => void;
   style?: ViewStyle;
}

// ==================== Trust Authority Types ====================
export interface TrustFeature {
   id: string;
   title: string;
   description: string;
   icon: string;
   iconLibrary?: string;
}

export interface TrustAuthorityProps {
   features?: TrustFeature[];
   style?: ViewStyle;
}

// ==================== Shop Types ====================
export interface ShopItem {
   id: string;
   title: string;
   description: string;
   imageUrl?: any;
   price?: number;
   webUrl: string;
}

export interface ShopProps {
   items?: ShopItem[];
   onShopPress?: (item: ShopItem) => void;
   onViewAllPress?: () => void;
   style?: ViewStyle;
}

// ==================== Blog Types ====================
export interface BlogPost {
   id: string;
   title: string;
   excerpt: string;
   imageUrl?: any;
   author?: string;
   date?: string;
   readTime?: string;
   image?: any;
}

export interface BlogProps {
   posts?: BlogPost[];
   onPostPress?: (post: BlogPost) => void;
   onViewAllPress?: () => void;
   style?: ViewStyle;
}