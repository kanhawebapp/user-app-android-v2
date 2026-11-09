import {useCallback, useEffect, useRef, useState} from 'react';

import {getFollowedAstrologers} from './followed-astrologers.api';

import {FollowedAstrologer} from './followed-astrologers.types';

const PAGE_LIMIT = 10;

export const useFollowedAstrologers = () => {
  const [data, setData] = useState<FollowedAstrologer[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const isFetchingRef = useRef(false);
  const hasFetchedRef = useRef(false);

  const fetchAstrologers = useCallback(
    async (
      pageNumber: number = 1,
      options: {
        isLoadMore?: boolean;
        isRefresh?: boolean;
      } = {},
    ) => {
      const {isLoadMore = false, isRefresh = false} = options;

      if (isFetchingRef.current) {
        return;
      }

      isFetchingRef.current = true;

      try {
        setError(null);

        if (isRefresh) {
          setRefreshing(true);
        } else if (isLoadMore) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const response = await getFollowedAstrologers(
          pageNumber,
          PAGE_LIMIT,
        );

        const astrologers = response.astrologers || [];
        const nextPage = response.page || pageNumber;
        const nextTotalPages = response.totalPages || 1;

        setData(prev =>
          isLoadMore ? [...prev, ...astrologers] : astrologers,
        );
        setPage(nextPage);
        setTotal(response.total || 0);
        setTotalPages(nextTotalPages);
        setHasMore(nextPage < nextTotalPages);
        hasFetchedRef.current = true;
      } catch (err: any) {
        console.log('FOLLOWED ASTROLOGERS HOOK ERROR:', err);

        const message =
          err?.message ||
          err?.response?.data?.errors?.[0]?.message ||
          'Failed to load followed astrologers';

        setError(message);

        if (!isLoadMore) {
          setData([]);
          setPage(1);
          setTotal(0);
          setTotalPages(1);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [],
  );

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || refreshing || !hasMore) {
      return;
    }

    await fetchAstrologers(page + 1, {isLoadMore: true});
  }, [
    fetchAstrologers,
    hasMore,
    loading,
    loadingMore,
    page,
    refreshing,
  ]);

  const refresh = useCallback(async () => {
    await fetchAstrologers(1, {isRefresh: true});
  }, [fetchAstrologers]);

  useEffect(() => {
    if (hasFetchedRef.current) {
      return;
    }

    fetchAstrologers(1);
  }, [fetchAstrologers]);

  return {
    data,
    loading,
    refreshing,
    loadingMore,
    error,
    page,
    total,
    totalPages,
    hasMore,
    loadMore,
    refresh,
  };
};
