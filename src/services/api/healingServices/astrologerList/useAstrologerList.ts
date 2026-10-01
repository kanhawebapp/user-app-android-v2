import {
  useCallback,
  useEffect,
  useRef,
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

    // Callers usually pass an inline object (`{ page: 1, limit: 20 }`),
    // which is a new reference on every render. Keeping it in a ref keeps
    // `fetchAstrologers` stable, so the fetch effect below runs exactly
    // once per mount instead of looping on every render.
    const initialFiltersRef =
      useRef<AstrologerSearchInput | undefined>(
        initialFilters,
      );

    // Only the newest in-flight request may write to state, so a slow
    // response for a previous filter set can never clobber the current one.
    const requestIdRef = useRef(0);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;

      return () => {
        isMountedRef.current = false;
      };
    }, []);

    const fetchAstrologers =
      useCallback(
        async (
          filters?: AstrologerSearchInput,
        ) => {
          const requestId = ++requestIdRef.current;

          try {
            setLoading(true);

            setError(null);

            const response =
              await getAstrologerListForUser(
                filters ??
                  initialFiltersRef.current,
              );

            if (
              requestId !== requestIdRef.current ||
              !isMountedRef.current
            ) {
              return;
            }

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
            if (
              requestId !== requestIdRef.current ||
              !isMountedRef.current
            ) {
              return;
            }

            console.log(
              'ASTROLOGER LIST HOOK ERROR:',
              err,
            );

            setError(err);
          } finally {
            if (
              requestId === requestIdRef.current &&
              isMountedRef.current
            ) {
              setLoading(false);
            }
          }
        },
        [],
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
