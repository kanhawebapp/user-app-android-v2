import {useEffect, useState} from 'react';

import {getUserCallHistory} from './call-history.api';

import {
  CallHistoryItem,
  CallHistorySummary,
  UserCallHistoryFilterInput,
} from './call-history.types';

export const useCallHistory = (filters?: UserCallHistoryFilterInput) => {
  const [data, setData] = useState<CallHistoryItem[]>([]);

  const [summary, setSummary] = useState<CallHistorySummary | null>(null);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [totalPages, setTotalPages] = useState(1);

  const [totalCount, setTotalCount] = useState(0);

  const fetchCallHistory = async (
    pageNumber = 1,
    extraFilters?: UserCallHistoryFilterInput,
  ) => {
    try {
      if (pageNumber > totalPages) {
        return;
      }

      setLoading(true);

      const res = await getUserCallHistory({
        limit: 10,

        page: pageNumber,

        ...filters,

        ...extraFilters,
      });

      console.log(
        'CALL HISTORY PAGE:',
        res.currentPage,
        'TOTAL:',
        res.totalPages,
      );

      if (pageNumber === 1) {
        setData(res.data || []);
      } else {
        setData(prev => [...prev, ...(res.data || [])]);
      }

      setSummary(res.summary || null);

      setTotalCount(res.totalCount || 0);

      setPage(res.currentPage || 1);

      setTotalPages(res.totalPages || 1);
    } catch (error) {
      console.log('CALL HISTORY HOOK ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCallHistory(1);
  }, []);

  const loadMore = () => {
    if (!loading && page < totalPages) {
      fetchCallHistory(page + 1);
    }
  };

  const refresh = () => {
    fetchCallHistory(1);
  };

  return {
    data,

    summary,

    loading,

    page,

    totalPages,

    totalCount,

    loadMore,

    refresh,

    fetchCallHistory,
  };
};
