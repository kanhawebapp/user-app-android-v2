import {useEffect, useState} from 'react';
import {getUserSessions} from './sessions.api';
import {Session, SessionStatus} from './sessions.types';

export const useUserSessions = () => {
  const [data, setData] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<SessionStatus | null>(null);

  const fetchSessions = async (
    pageNumber = 1,
    selectedStatus?: SessionStatus | null,
    extraFilters: any = {},
  ) => {
    try {
      if (pageNumber > totalPages && pageNumber !== 1) return;

      setLoading(true);

      const res = await getUserSessions({
        page: pageNumber,
        limit: 10,
        status: selectedStatus || undefined,
        ...extraFilters, // ✅ for date filters
      });

      if (pageNumber === 1) {
        setData(res.data);
      } else {
        setData(prev => [...prev, ...res.data]);
      }

      setPage(res.currentPage);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.log('HOOK ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions(1, status);
  }, [status]);

  // 🔥 FILTER BY STATUS
  const applyStatusFilter = (newStatus: SessionStatus | null) => {
    setStatus(newStatus);
    setPage(1);
  };

  // 🔥 DATE FILTER
  const applyDateFilter = (fromDate: string, toDate: string) => {
    fetchSessions(1, status, {fromDate, toDate});
  };

  // 🔥 PAGINATION
  const loadMore = () => {
    if (!loading && page < totalPages) {
      fetchSessions(page + 1, status);
    }
  };

  // 🔥 REFRESH
  const refresh = () => {
    setPage(1);
    fetchSessions(1, status);
  };

  return {
    data,
    loading,
    page,
    totalPages,
    applyStatusFilter,
    applyDateFilter,
    loadMore,
    refresh,
  };
};
