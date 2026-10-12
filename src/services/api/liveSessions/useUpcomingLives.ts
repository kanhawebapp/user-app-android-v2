import {useCallback, useEffect, useRef, useState} from 'react';

import {getUpcomingLives} from './live-sessions.api';

import {UpcomingLive} from './live-sessions.types';

export const useUpcomingLives = (limit = 10) => {
  const [data, setData] = useState<UpcomingLive[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  const [totalCount, setTotalCount] = useState(0);

  const currentPageRef = useRef(0);
  const totalPagesRef = useRef(1);
  const inFlightRef = useRef(false);
  // A newer first-page request invalidates any pending response
  const requestIdRef = useRef(0);

  const fetchFirstPage = useCallback(
    async (isRefresh = false) => {
      const requestId = ++requestIdRef.current;
      inFlightRef.current = true;

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setLoadingMore(false);

      try {
        const res = await getUpcomingLives({page: 1, limit});

        if (requestId !== requestIdRef.current) {
          return;
        }

        setData(res.data || []);
        setTotalCount(res.totalCount || 0);
        currentPageRef.current = res.currentPage || 1;
        totalPagesRef.current = res.totalPages || 1;
        setError(null);
      } catch (err: any) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        console.log('UPCOMING LIVES HOOK ERROR:', err);
        setError(err);
      } finally {
        if (requestId === requestIdRef.current) {
          inFlightRef.current = false;
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [limit],
  );

  const loadMore = useCallback(async () => {
    if (
      inFlightRef.current ||
      currentPageRef.current >= totalPagesRef.current
    ) {
      return;
    }

    const requestId = requestIdRef.current;
    const nextPage = currentPageRef.current + 1;
    inFlightRef.current = true;
    setLoadingMore(true);

    try {
      const res = await getUpcomingLives({page: nextPage, limit});

      if (requestId !== requestIdRef.current) {
        return;
      }

      setData(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        return [
          ...prev,
          ...(res.data || []).filter(item => !existingIds.has(item.id)),
        ];
      });
      setTotalCount(res.totalCount || 0);
      currentPageRef.current = res.currentPage || nextPage;
      totalPagesRef.current = res.totalPages || totalPagesRef.current;
    } catch (err: any) {
      console.log('UPCOMING LIVES LOAD MORE ERROR:', err);
    } finally {
      if (requestId === requestIdRef.current) {
        inFlightRef.current = false;
        setLoadingMore(false);
      }
    }
  }, [limit]);

  const refresh = useCallback(() => fetchFirstPage(true), [fetchFirstPage]);

  const retry = useCallback(() => fetchFirstPage(false), [fetchFirstPage]);

  useEffect(() => {
    fetchFirstPage();
  }, [fetchFirstPage]);

  return {
    data,

    totalCount,

    loading,

    refreshing,

    loadingMore,

    error,

    refresh,

    retry,

    loadMore,
  };
};
