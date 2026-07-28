/**
 * Home Screen Data Hook
 * Manages authentication flow and provides data for home screen components
 */

import {useState, useCallback, useMemo} from 'react';
// import { useAuthStore } from '../../../stores';
import {images} from '../../../../assets/images';
import {
  HeroBannerData,
  GuidanceItem,
  QuickService,
  LiveSession,
  Astrologer,
  ProblemCategory,
  Remedy,
  Testimonial,
  TrustFeature,
  AuthActionCallback,
  ShopItem,
  BlogPost,
} from '../types';
import useAuthStore from '../../../../stores/auth.store';

// Default hero banners
// const DEFAULT_HERO_BANNERS: HeroBannerData[] = [
//   {
//     id: '1',
//     title: 'Welcome to Dhwani Astro',
//     subtitle: 'Your spiritual journey starts here',
//     ctaText: 'Explore Now',
//     ctaAction: 'explore',
//     imageUrl: images.Banner1,
//   },
//   {
//     id: '2',
//     title: 'Consult Expert Astrologers',
//     subtitle: 'Get accurate predictions for your future',
//     ctaText: 'Chat Now',
//     ctaAction: 'chat',
//     imageUrl: images.Banner2,
//   },
//   {
//     id: '3',
//     title: 'Live Sessions',
//     subtitle: 'Join interactive sessions with top astrologers',
//     ctaText: 'Join Live',
//     ctaAction: 'live',
//     imageUrl: images.Banner3,
//   },
// ];

// Default guidance items
const DEFAULT_GUIDANCE_ITEMS: GuidanceItem[] = [
  {
    id: '1',
    title: 'Career',
    description: 'Get guidance for your professional life',
    icon: 'work',
    iconLibrary: 'MaterialIcons',
  },
  {
    id: '2',
    title: 'Love',
    description: 'Find answers about your love life',
    icon: 'favorite',
    iconLibrary: 'MaterialIcons',
  },
  {
    id: '3',
    title: 'Finance',
    description: 'Improve your financial stability',
    icon: 'attach-money',
    iconLibrary: 'MaterialIcons',
  },
  {
    id: '4',
    title: 'Health',
    description: 'Stay healthy and fit',
    icon: 'health-and-safety',
    iconLibrary: 'MaterialIcons',
  },
];

// Default quick services
const DEFAULT_QUICK_SERVICES: QuickService[] = [
  {
    id: '1',
    title: 'Chat',
    icon: 'chat',
    iconLibrary: 'MaterialIcons',
    backgroundColor: '#6200EE20',
    iconColor: '#6200EE',
  },
  {
    id: '2',
    title: 'Call',
    icon: 'call',
    iconLibrary: 'MaterialIcons',
    backgroundColor: '#03DAC620',
    iconColor: '#03DAC6',
  },
  {
    id: '3',
    title: 'Live',
    icon: 'live-tv',
    iconLibrary: 'MaterialIcons',
    backgroundColor: '#F4433630',
    iconColor: '#F44336',
  },
  {
    id: '4',
    title: 'Remedies',
    icon: 'spa',
    iconLibrary: 'MaterialIcons',
    backgroundColor: '#4CAF5030',
    iconColor: '#4CAF50',
  },
];

// Default live sessions (ongoing)
const DEFAULT_ONGOING_LIVES: LiveSession[] = [
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

// Default upcoming live sessions
const DEFAULT_UPCOMING_LIVES: LiveSession[] = [
  {
    id: '1',
    title: 'Love Relationship Reading',
    astrologerName: 'Astrologer Sneha',
    status: 'upcoming',
    scheduledTime: 'Today, 5:00 PM',
    duration: '1 hour',
  },
  {
    id: '2',
    title: 'Career Growth Session',
    astrologerName: 'Astrologer Raj',
    status: 'upcoming',
    scheduledTime: 'Tomorrow, 3:00 PM',
    duration: '45 mins',
  },
  {
    id: '3',
    title: 'Health & Wellness Astrology',
    astrologerName: 'Astrologer Meera',
    status: 'upcoming',
    scheduledTime: 'Tomorrow, 7:00 PM',
    duration: '1 hour',
  },
  {
    id: '4',
    title: 'Financial Planning 2024',
    astrologerName: 'Astrologer Vikram',
    status: 'upcoming',
    scheduledTime: 'Feb 20, 6:00 PM',
    duration: '1 hour',
  },
];

// Default recommended astrologers
const DEFAULT_ASTROLOGERS: Astrologer[] = [
  {
    id: '1',
    name: 'Pandit Rahul Sharma',
    rating: 4.9,
    experience: '15 years',
    specialties: ['Kundli', 'Vastu', 'Gemology'],
    availability: 'online',
    hourlyRate: 500,
  },
  {
    id: '2',
    name: 'Acharya Priya Mishra',
    rating: 4.8,
    experience: '12 years',
    specialties: ['Love', 'Career', 'Palmistry'],
    availability: 'online',
    hourlyRate: 450,
  },
  {
    id: '3',
    name: 'Dr. Amit Verma',
    rating: 4.7,
    experience: '20 years',
    specialties: ['Numerology', 'Tarot', 'Healing'],
    availability: 'busy',
    hourlyRate: 600,
  },
];

// Default problem categories
const DEFAULT_PROBLEM_CATEGORIES: ProblemCategory[] = [
  {
    id: '1',
    title: 'Career',
    icon: 'work',
    iconLibrary: 'MaterialIcons',
    count: 120,
    color: '#6200EE',
  },
  {
    id: '2',
    title: 'Love',
    icon: 'favorite',
    iconLibrary: 'MaterialIcons',
    count: 95,
    color: '#E91E63',
  },
  {
    id: '3',
    title: 'Marriage',
    icon: 'family-restroom',
    iconLibrary: 'MaterialIcons',
    count: 85,
    color: '#FF9800',
  },
  {
    id: '4',
    title: 'Finance',
    icon: 'trending-up',
    iconLibrary: 'MaterialIcons',
    count: 72,
    color: '#4CAF50',
  },
  {
    id: '5',
    title: 'Health',
    icon: 'favorite-border',
    iconLibrary: 'MaterialIcons',
    count: 68,
    color: '#F44336',
  },
  {
    id: '6',
    title: 'Education',
    icon: 'school',
    iconLibrary: 'MaterialIcons',
    count: 55,
    color: '#2196F3',
  },
];

// Default featured remedies
const DEFAULT_REMEDIES: Remedy[] = [
  {
    id: '1',
    title: 'Mars Remedy Pack',
    description: 'Strengthen Mars for better energy',
    price: 999,
    duration: '7 days',
  },
  {
    id: '2',
    title: 'Venus Gemstone',
    description: 'Enhance love and relationships',
    price: 2499,
    duration: 'Permanent',
  },
  {
    id: '3',
    title: 'Money Mantra',
    description: 'Attract financial abundance',
    price: 599,
    duration: '21 days',
  },
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    userName: 'Rajesh Kumar',
    rating: 5,
    comment:
      'Amazing experience! The astrology reading was very accurate and helpful.',
    date: '2 days ago',
    location: 'Delhi, India',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    id: '2',
    userName: 'Priya Singh',
    rating: 5,
    comment: 'Got great insights about my career. Highly recommended!',
    date: '1 week ago',
    location: 'Mumbai, India',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '3',
    userName: 'Amit Patel',
    rating: 4,
    comment: 'Very knowledgeable astrologers. Will definitely consult again.',
    date: '2 weeks ago',
    location: 'Ahmedabad, India',
    image: 'https://randomuser.me/api/portraits/men/65.jpg',
  },
];

const DEFAULT_TRUST_FEATURES: TrustFeature[] = [
  {
    id: '1',
    title: 'Verified Astrologers',
    description: 'All astrologers are verified experts',
    icon: 'verified-user',
    iconLibrary: 'MaterialIcons',
  },

  {
    id: '5',
    title: '10+ Years Experience',
    description: 'Trusted astrology expertise over a decade',
    icon: 'workspace-premium',
    iconLibrary: 'MaterialIcons',
  },
  {
    id: '6',
    title: '13L+ Happy Customers',
    description: 'Loved by millions of users across India',
    icon: 'groups',
    iconLibrary: 'MaterialIcons',
  },
  {
    id: '7',
    title: 'Certified & Abhimantrit',
    description: 'Spiritual and certified astrologers',
    icon: 'auto-awesome',
    iconLibrary: 'MaterialIcons',
  },
  {
    id: '8',
    title: 'Safe & Trusted Guidance',
    description: 'Your privacy and trust is our priority',
    icon: 'shield',
    iconLibrary: 'MaterialIcons',
  },
];

// Default shop items
const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  {
    id: '1',
    title: 'Astrology Products',
    description: 'Gemstones, Yantras, and more',
    price: 0,
    webUrl: 'https://example.com/shop',
  },
  {
    id: '2',
    title: 'Spiritual Books',
    description: 'Vedic astrology and remedies',
    price: 499,
    webUrl: 'https://example.com/shop/books',
  },
  {
    id: '3',
    title: 'Puja Kits',
    description: 'Complete puja packages',
    price: 999,
    webUrl: 'https://example.com/shop/kits',
  },
  {
    id: '4',
    title: 'Online Courses',
    description: 'Learn astrology at home',
    price: 2499,
    webUrl: 'https://example.com/shop/courses',
  },
];

const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Kundli',
    excerpt:
      'Learn the basics of Kundli reading and its importance in Vedic astrology',
    author: 'Astrologer Rahul',
    readTime: '5 min read',
    image:
      'https://images.unsplash.com/photo-1604608672516-3e8b2c9d5c55?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '2',
    title: 'Gemstone Benefits',
    excerpt: 'Discover the healing powers of different gemstones',
    author: 'Acharya Priya',
    readTime: '7 min read',
    image:
      'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '3',
    title: 'Vastu Shastra Tips',
    excerpt: 'Improve your home energy with these Vastu tips',
    author: 'Dr. Amit Verma',
    readTime: '6 min read',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60',
  },
  {
    id: '4',
    title: 'Daily Horoscope',
    excerpt: 'What the stars have in store for you today',
    author: 'Team Dhwani',
    readTime: '3 min read',
    image:
      'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=800&q=60',
  },
];

export interface UseHomeDataProps {
  heroBanners?: HeroBannerData[];
  guidanceItems?: GuidanceItem[];
  quickServices?: QuickService[];
  ongoingLives?: LiveSession[];
  upcomingLives?: LiveSession[];
  astrologers?: Astrologer[];
  problemCategories?: ProblemCategory[];
  remedies?: Remedy[];
  testimonials?: Testimonial[];
  trustFeatures?: TrustFeature[];
  shopItems?: ShopItem[];
  blogPosts?: BlogPost[];
}

export interface UseHomeDataReturn {
  // Auth state
  isAuthenticated: boolean;
  isGuest: boolean;

  // Auth handlers
  handleRestrictedAction: (
    actionMessage: string,
    callback?: AuthActionCallback,
  ) => void;

  // Data
  heroBanners: HeroBannerData[];
  guidanceItems: GuidanceItem[];
  quickServices: QuickService[];
  ongoingLives: LiveSession[];
  upcomingLives: LiveSession[];
  astrologers: Astrologer[];
  problemCategories: ProblemCategory[];
  remedies: Remedy[];
  testimonials: Testimonial[];
  trustFeatures: TrustFeature[];
  shopItems: ShopItem[];
  blogPosts: BlogPost[];

  // Modal state
  showLoginModal: boolean;
  modalMessage: string;
  setShowLoginModal: (show: boolean) => void;
  setModalMessage: (message: string) => void;
}

export const useHomeData = (props?: UseHomeDataProps): UseHomeDataReturn => {
  // Auth state from store
  const isAuthenticated = useAuthStore(
    (state: {isAuthenticated: any}) => state.isAuthenticated,
  );
  const isGuest = useAuthStore((state: {isGuest: any}) => state.isGuest);

  // Modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    'Please login to perform this action',
  );

  // Check if user can perform action
  const handleRestrictedAction = useCallback(
    (actionMessage: string, callback?: AuthActionCallback) => {
      if (isAuthenticated) {
        // User is authenticated, allow the action
        callback?.();
        return;
      }

      // Show login modal for guest users
      setModalMessage(actionMessage);
      setShowLoginModal(true);
    },
    [isAuthenticated],
  );

  // Memoize data
  const data = useMemo(
    () => ({
      // heroBanners: props?.heroBanners ?? DEFAULT_HERO_BANNERS,
      heroBanners: props?.heroBanners ?? [],
      guidanceItems: props?.guidanceItems ?? DEFAULT_GUIDANCE_ITEMS,
      quickServices: props?.quickServices ?? DEFAULT_QUICK_SERVICES,
      ongoingLives: props?.ongoingLives ?? DEFAULT_ONGOING_LIVES,
      upcomingLives: props?.upcomingLives ?? DEFAULT_UPCOMING_LIVES,
      astrologers: props?.astrologers ?? DEFAULT_ASTROLOGERS,
      problemCategories: props?.problemCategories ?? DEFAULT_PROBLEM_CATEGORIES,
      remedies: props?.remedies ?? DEFAULT_REMEDIES,
      testimonials: props?.testimonials ?? DEFAULT_TESTIMONIALS,
      trustFeatures: props?.trustFeatures ?? DEFAULT_TRUST_FEATURES,
      shopItems: props?.shopItems ?? DEFAULT_SHOP_ITEMS,
      blogPosts: props?.blogPosts ?? DEFAULT_BLOG_POSTS,
    }),
    [props],
  );

  return {
    // Auth state
    isAuthenticated,
    isGuest,

    // Auth handlers
    handleRestrictedAction,

    // Data
    ...data,

    // Modal state
    showLoginModal,
    modalMessage,
    setShowLoginModal,
    setModalMessage,
  };
};

export default useHomeData;
