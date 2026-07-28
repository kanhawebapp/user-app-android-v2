/**
 * useChatCall Hook
 * Custom hook for Chat/Call screen logic including filtering and search
 */

import {useState, useMemo, useCallback} from 'react';
import {Astrologer, FilterOptions, TabType} from '../types';

// Sample astrologers data (in production, this would come from an API)
const SAMPLE_ASTROLOGERS: Astrologer[] = [
  {
    id: '1',
    name: 'Astrologer Rahul',
    rating: 4.8,
    reviewCount: 1250,
    experience: '10+ years',
    languages: ['Hindi', 'English'],
    skills: ['Vedic Astrology', 'Numerology', 'KP Astrology'],
    availability: 'online',
    chatRate: 5,
    callRate: 10,
    isAvailableForChat: true,
    isAvailableForCall: true,
  },
  {
    id: '2',
    name: 'Astrologer Priya',
    rating: 4.9,
    reviewCount: 980,
    experience: '8+ years',
    languages: ['Hindi', 'English', 'Tamil'],
    skills: ['Vastu', 'Palmistry', 'Tarot'],
    availability: 'online',
    chatRate: 8,
    callRate: 15,
    isAvailableForChat: true,
    isAvailableForCall: false,
  },
  {
    id: '3',
    name: 'Astrologer Sharma',
    rating: 4.7,
    reviewCount: 2100,
    experience: '15+ years',
    languages: ['Hindi', 'English', 'Bengali'],
    skills: ['Vedic Astrology', 'Kundli', 'Horoscope'],
    availability: 'offline',
    chatRate: 10,
    callRate: 20,
    isAvailableForChat: true,
    isAvailableForCall: true,
  },
  {
    id: '4',
    name: 'Astrologer Verma',
    rating: 4.6,
    reviewCount: 750,
    experience: '12+ years',
    languages: ['Hindi', 'English'],
    skills: ['Tarot Reading', 'Career Guidance', 'Numerology'],
    availability: 'busy',
    chatRate: 7,
    callRate: 12,
    isAvailableForChat: false,
    isAvailableForCall: true,
  },
  {
    id: '5',
    name: 'Astrologer Singh',
    rating: 4.5,
    reviewCount: 500,
    experience: '6+ years',
    languages: ['Hindi', 'English', 'Punjabi'],
    skills: ['Vedic Astrology', 'Love Reading'],
    availability: 'online',
    chatRate: 4,
    callRate: 8,
    isAvailableForChat: true,
    isAvailableForCall: true,
  },
  {
    id: '6',
    name: 'Astrologer Kumar',
    rating: 4.4,
    reviewCount: 320,
    experience: '5+ years',
    languages: ['Hindi', 'Telugu'],
    skills: ['KP Astrology', 'Prashna', 'Horary'],
    availability: 'offline',
    chatRate: 6,
    callRate: 10,
    isAvailableForChat: true,
    isAvailableForCall: false,
  },
  {
    id: '7',
    name: 'Astrologer Patel',
    rating: 4.9,
    reviewCount: 1800,
    experience: '20+ years',
    languages: ['Hindi', 'English', 'Gujarati'],
    skills: ['Vastu Shastra', 'Muhurta', 'Remedies'],
    availability: 'online',
    chatRate: 15,
    callRate: 25,
    isAvailableForChat: true,
    isAvailableForCall: true,
  },
  {
    id: '8',
    name: 'Astrologer Gupta',
    rating: 4.3,
    reviewCount: 250,
    experience: '4+ years',
    languages: ['Hindi', 'English'],
    skills: ['Numerology', 'Baby Name Suggestion'],
    availability: 'busy',
    chatRate: 3,
    callRate: 5,
    isAvailableForChat: true,
    isAvailableForCall: false,
  },
];

// Default filter options
const DEFAULT_FILTERS: FilterOptions = {
  availability: 'all',
  priceRange: {min: 0, max: Infinity},
  rating: 'all',
  languages: [],
};

export interface UseChatCallReturn {
  // State
  astrologers: Astrologer[];
  filteredAstrologers: Astrologer[];
  filters: FilterOptions;
  searchQuery: string;
  activeTab: TabType;

  // Actions
  setFilters: (filters: FilterOptions) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: TabType) => void;
  clearFilters: () => void;

  // Computed
  availableLanguages: string[];
  onlineCount: number;
  totalCount: number;
}

export const useChatCall = (): UseChatCallReturn => {
  // State
  const [astrologers] = useState<Astrologer[]>(SAMPLE_ASTROLOGERS);
  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  // Get unique languages from all astrologers
  const availableLanguages = useMemo(() => {
    const languages = new Set<string>();
    astrologers.forEach(astrologer => {
      astrologer.languages.forEach(lang => languages.add(lang));
    });
    return Array.from(languages).sort();
  }, [astrologers]);

  // Filter astrologers based on current filters and search
  const filteredAstrologers = useMemo(() => {
    return astrologers.filter(astrologer => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          astrologer.name.toLowerCase().includes(query) ||
          astrologer.skills.some(skill =>
            skill.toLowerCase().includes(query),
          ) ||
          astrologer.languages.some(lang => lang.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Availability filter
      if (filters.availability !== 'all') {
        if (
          filters.availability === 'online' &&
          astrologer.availability !== 'online'
        ) {
          return false;
        }
        if (
          filters.availability === 'offline' &&
          astrologer.availability !== 'offline'
        ) {
          return false;
        }
      }

      // Price filter
      const currentRate =
        activeTab === 'chat' ? astrologer.chatRate : astrologer.callRate;
      if (
        currentRate < filters.priceRange.min ||
        currentRate > filters.priceRange.max
      ) {
        return false;
      }

      // Rating filter
      if (filters.rating !== 'all') {
        const minRating = filters.rating === '4+' ? 4 : 3;
        if (astrologer.rating < minRating) {
          return false;
        }
      }

      // Language filter
      if (filters.languages.length > 0) {
        const hasMatchingLanguage = astrologer.languages.some(lang =>
          filters.languages.includes(lang),
        );
        if (!hasMatchingLanguage) return false;
      }

      return true;
    });
  }, [astrologers, filters, searchQuery, activeTab]);

  // Count online astrologers
  const onlineCount = useMemo(
    () => astrologers.filter(a => a.availability === 'online').length,
    [astrologers],
  );

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  }, []);

  return {
    // State
    astrologers,
    filteredAstrologers,
    filters,
    searchQuery,
    activeTab,

    // Actions
    setFilters,
    setSearchQuery,
    setActiveTab,
    clearFilters,

    // Computed
    availableLanguages,
    onlineCount,
    totalCount: astrologers.length,
  };
};

export default useChatCall;
