import { useState, useMemo, useCallback } from 'react';
import { Astrologer, FilterOptions, TabType } from '../types';

// Default filter options
const DEFAULT_FILTERS: FilterOptions = {
  availability: 'all',
  priceRange: { min: 0, max: Infinity },
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

export const useChatCall = (
  astrologersData: Astrologer[] = [],
): UseChatCallReturn => {
  // State
  const astrologers = astrologersData;
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
        if (!matchesSearch) {
          return false;
        }
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
        if (!hasMatchingLanguage) {
          return false;
        }
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
