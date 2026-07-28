import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {getAstrologerListForUser} from './astrologer-list.api';

import {
  Astrologer,
  AstrologerSearchInput,
} from './astrologer-list.types';

export const useAstrologerList =
  (
    initialFilters?: AstrologerSearchInput,
  ) => {
    const [astrologers, setAstrologers] =
      useState<Astrologer[]>([]);

    const [totalCount, setTotalCount] =
      useState(0);

    const [currentPage, setCurrentPage] =
      useState(1);

    const [totalPages, setTotalPages] =
      useState(1);

    const [loading, setLoading] =
      useState(false);

    const [error, setError] =
      useState<any>(null);

    const fetchAstrologers =
      useCallback(
        async (
          filters?: AstrologerSearchInput,
        ) => {
          try {
            setLoading(true);

            setError(null);

            const response =
              await getAstrologerListForUser(
                filters ||
                  initialFilters,
              );

            setAstrologers(
              response?.data || [],
            );

            setTotalCount(
              response?.totalCount || 0,
            );

            setCurrentPage(
              response?.currentPage || 1,
            );

            setTotalPages(
              response?.totalPages || 1,
            );
          } catch (err: any) {
            console.log(
              'ASTROLOGER LIST HOOK ERROR:',
              err,
            );

            setError(err);
          } finally {
            setLoading(false);
          }
        },
        [initialFilters],
      );

    useEffect(() => {
      fetchAstrologers();
    }, [fetchAstrologers]);

    return {
      astrologers,

      totalCount,

      currentPage,

      totalPages,

      loading,

      error,

      refresh: fetchAstrologers,
    };
  };