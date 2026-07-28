import {useCallback, useEffect, useRef, useState} from 'react';
import {getAstrologers} from './astrologer.api';
import {Astrologer, AstrologerSearchInput} from './astrologer.types';

interface FiltersState {
  sortField?: 'RATING' | 'PRICE' | 'EXPERIENCE';
  sortOrder?: 'ASC' | 'DESC';
  skills?: string[];
  languages?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  minExperience?: number;
  search?: string;
}

export const useAstrologers = () => {
  const [data, setData] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // mutable ref — latest filters are always available to `fetchAstrologers`
  // regardless of what `filters` value was at the time the callback was created
  const filtersRef = useRef<FiltersState>({
    sortField: 'RATING',
    sortOrder: 'DESC',
  });

  const [filters, setFiltersState] = useState<FiltersState>({
    sortField: 'RATING',
    sortOrder: 'DESC',
  });

  const fetchAstrologers = useCallback(
    async (pageNumber = 1, currentFilters?: FiltersState) => {
      const usedFilters = currentFilters ?? filtersRef.current;

      setLoading(true);

      const searchInput: AstrologerSearchInput = {
        limit: 10,
        page: pageNumber,
        ...(usedFilters.sortField && {sortField: usedFilters.sortField}),
        ...(usedFilters.sortOrder && {sortOrder: usedFilters.sortOrder}),
        skills: usedFilters.skills,
        languages: usedFilters.languages,
        minPrice: usedFilters.minPrice,
        maxPrice: usedFilters.maxPrice,
        minRating: usedFilters.minRating,
        minExperience: usedFilters.minExperience,
        search: usedFilters.search,
      };

      try {
        const res = await getAstrologers(searchInput);

        console.log(
          'ASTROLOGER PAGE:',
          pageNumber,
          'TOTAL PAGES:',
          res.totalPages,
        );

        if (pageNumber === 1) {
          setData(res.data || []);
        } else {
          setData(prev => [...prev, ...(res.data || [])]);
        }

        setPage(pageNumber);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        console.log('ASTROLOGER ERROR:', error);
      } finally {
        setLoading(false);
      }
    },
    [], // stable — reads filters via filtersRef default-param, never list-based closes over totalPages
  );

  // Keep the ref in sync with the latest `filters` state on every render.
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Initial mount: fetch page 1
  useEffect(() => {
    fetchAstrologers(1);
  }, [fetchAstrologers]);

  // Whenever any filter value changes, reset to page 1 and refetch.
  useEffect(() => {
    fetchAstrologers(1);
  }, [fetchAstrologers, filters]);

  const changeFilter = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K],
  ) => {
    setFiltersState(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetFilters = () => {
    setFiltersState({
      sortField: 'RATING',
      sortOrder: 'DESC',
    });
  };

  const loadMore = () => {
    if (!loading && page < totalPages) {
      fetchAstrologers(page + 1);
    }
  };

  return {
    data,
    loading,
    loadMore,
    page,
    totalPages,
    filters,
    changeFilter,
    resetFilters,
    refresh: () => fetchAstrologers(1),
  };
};
