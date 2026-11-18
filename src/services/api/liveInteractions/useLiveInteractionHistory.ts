import {useCallback, useEffect, useRef, useState} from 'react';
import {getMyLiveInteractionHistory} from './live-interactions.api';
import type {
  LiveInteractionHistoryItem,
  LiveInteractionHistoryResult,
  MyLiveInteractionHistorySearchInput,
} from './live-interactions.types';

const DEFAULT_LIMIT = 10;

const EMPTY_SUMMARY = {
  totalCount: 0,
  totalCoinsDeducted: 0,
  totalAudioCalls: 0,
  totalVideoCalls: 0,
};

const mergeUniqueBySessionId = (
  existing: LiveInteractionHistoryItem[],
  incoming: LiveInteractionHistoryItem[],
): LiveInteractionHistoryItem[] => {
  if (incoming.length === 0) {
    return existing;
  }

  const seen = new Set(
    existing.map(item => item.sessionId).filter(Boolean),
  );
  const uniqueIncoming = incoming.filter(item => {
    if (!item.sessionId || seen.has(item.sessionId)) {
      return false;
    }
    seen.add(item.sessionId);
    return true;
  });

  return uniqueIncoming.length === 0
    ? existing
    : [...existing, ...uniqueIncoming];
};

export interface UseLiveInteractionHistoryOptions {
  limit?: number;
}

export const useLiveInteractionHistory = (
  options: UseLiveInteractionHistoryOptions = {},
) => {
  const limit = options.limit ?? DEFAULT_LIMIT;

  const [data, setData] = useState<LiveInteractionHistoryItem[]>([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const requestIdRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const totalPagesRef = useRef(1);

  const syncHasMore = useCallback((value: boolean) => {
    hasMoreRef.current = value;
    setHasMore(value);
  }, []);

  const applySummary = useCallback((result: LiveInteractionHistoryResult) => {
    setSummary({
      totalCount: result.totalCount ?? 0,
      totalCoinsDeducted: result.totalCoinsDeducted ?? 0,
      totalAudioCalls: result.totalAudioCalls ?? 0,
      totalVideoCalls: result.totalVideoCalls ?? 0,
    });
  }, []);

  const fetchPage = useCallback(
    async (page: number) => {
      const searchInput: MyLiveInteractionHistorySearchInput = {page, limit};
      return getMyLiveInteractionHistory(searchInput);
    },
    [limit],
  );

  const fetchInitial = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    loadingMoreRef.current = false;
    pageRef.current = 1;
    totalPagesRef.current = 1;
    syncHasMore(true);
    setData([]);
    setLoading(true);
    setLoadingMore(false);
    setError(null);

    try {
      const result = await fetchPage(1);

      if (requestId !== requestIdRef.current) {
        return;
      }

      const currentPage = result.currentPage ?? 1;
      const totalPages = Math.max(1, result.totalPages ?? 1);

      pageRef.current = currentPage;
      totalPagesRef.current = totalPages;
      syncHasMore(currentPage < totalPages);
      setData(result.data || []);
      applySummary(result);
    } catch (err: any) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(
        err?.message ||
          'Failed to load live interaction history. Please try again.',
      );
      setData([]);
      setSummary(EMPTY_SUMMARY);
      syncHasMore(false);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, [applySummary, fetchPage, syncHasMore]);

  const loadMore = useCallback(async () => {
    if (
      loadingMoreRef.current ||
      !hasMoreRef.current ||
      requestIdRef.current === 0
    ) {
      return;
    }

    const nextPage = pageRef.current + 1;
    if (nextPage > totalPagesRef.current) {
      syncHasMore(false);
      return;
    }

    const requestId = requestIdRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const result = await fetchPage(nextPage);

      if (requestId !== requestIdRef.current) {
        return;
      }

      const currentPage = result.currentPage ?? nextPage;
      const totalPages = Math.max(1, result.totalPages ?? totalPagesRef.current);

      pageRef.current = currentPage;
      totalPagesRef.current = totalPages;
      syncHasMore(currentPage < totalPages);
      applySummary(result);

      if ((result.data || []).length > 0) {
        setData(prev => mergeUniqueBySessionId(prev, result.data || []));
      }
    } catch (err: any) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      setError(
        err?.message ||
          'Failed to load more live interactions. Please try again.',
      );
    } finally {
      loadingMoreRef.current = false;
      if (requestId === requestIdRef.current) {
        setLoadingMore(false);
      }
    }
  }, [applySummary, fetchPage, syncHasMore]);

  useEffect(() => {
    fetchInitial();
  }, [fetchInitial]);

  return {
    data,
    summary,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh: fetchInitial,
  };
};
